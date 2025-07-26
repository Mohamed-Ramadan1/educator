import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, QueueEvents, Job } from 'bullmq';
import { LoggingService } from 'src/logging/services/logging.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface QueueJobData {
  [key: string]: any;
}

export interface JobOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
}

@Injectable()
export class QueueService implements OnModuleDestroy {
  private queueEvents: Map<string, QueueEvents> = new Map();

  constructor(
    private eventEmitter: EventEmitter2,
    private logger: LoggingService,
  ) {}

  async addJob<T = QueueJobData>(
    queueName: string,
    jobName: string,
    data: T,
    options?: JobOptions,
  ): Promise<Job<T>> {
    try {
      // This would be injected based on queue name
      const queue = this.getQueue(queueName);
      const job = await queue.add(jobName, data, options);

      this.logger.log(`Job ${job.id} added to ${queueName} queue`);
      this.eventEmitter.emit('job.added', {
        queueName,
        jobId: job.id,
        jobName,
      });

      return job;
    } catch (error) {
      this.logger.error(`Failed to add job to ${queueName}:`, error);
      throw error;
    }
  }

  async addBulkJobs<T = QueueJobData>(
    queueName: string,
    jobs: Array<{ name: string; data: T; opts?: JobOptions }>,
  ): Promise<Job<T>[]> {
    try {
      const queue = this.getQueue(queueName);
      const addedJobs = await queue.addBulk(jobs);

      this.logger.log(`${jobs.length} jobs added to ${queueName} queue`);
      this.eventEmitter.emit('jobs.bulk_added', {
        queueName,
        count: jobs.length,
      });

      return addedJobs;
    } catch (error) {
      this.logger.error(`Failed to add bulk jobs to ${queueName}:`, error);
      throw error;
    }
  }

  async getJob(queueName: string, jobId: string): Promise<Job | null> {
    const queue = this.getQueue(queueName);
    return queue.getJob(jobId);
  }

  async removeJob(queueName: string, jobId: string): Promise<boolean> {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.getJob(jobId);

      if (job) {
        await job.remove();
        this.logger.log(`Job ${jobId} removed from ${queueName}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `Failed to remove job ${jobId} from ${queueName}:`,
        error,
      );
      return false;
    }
  }

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.pause();
    this.logger.log(`Queue ${queueName} paused`);
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.resume();
    this.logger.log(`Queue ${queueName} resumed`);
  }

  setupQueueEvents(queueName: string): QueueEvents | undefined {
    if (this.queueEvents.has(queueName)) {
      return this.queueEvents.get(queueName);
    }

    const queueEvents = new QueueEvents(queueName);
    this.queueEvents.set(queueName, queueEvents);

    queueEvents.on('waiting', ({ jobId }) => {
      this.eventEmitter.emit('job.waiting', { queueName, jobId });
    });

    queueEvents.on('active', ({ jobId }) => {
      this.eventEmitter.emit('job.active', { queueName, jobId });
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
      this.eventEmitter.emit('job.completed', {
        queueName,
        jobId,
        returnvalue,
      });
    });

    queueEvents.on('failed', ({ jobId, failedReason }) => {
      this.eventEmitter.emit('job.failed', { queueName, jobId, failedReason });
    });

    queueEvents.on('stalled', ({ jobId }) => {
      this.logger.warn(`Job ${jobId} stalled in ${queueName}`);
      this.eventEmitter.emit('job.stalled', { queueName, jobId });
    });

    return queueEvents;
  }

  private getQueue(queueName: string): Queue {
    // This is a simplified version - in reality, you'd inject all queues
    // or use a queue registry pattern
    throw new Error(`Queue ${queueName} not found. Implement queue registry.`);
  }

  async onModuleDestroy() {
    for (const [name, queueEvents] of this.queueEvents) {
      await queueEvents.close();
      this.logger.log(`Queue events for ${name} closed`);
    }
    this.queueEvents.clear();
  }
}
