import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';

@Injectable()
export class QueueCleanupService {
  private readonly logger = new Logger(QueueCleanupService.name);
  private queues: Map<string, Queue> = new Map();

  registerQueue(name: string, queue: Queue) {
    this.queues.set(name, queue);
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldJobs() {
    this.logger.log('Starting daily queue cleanup...');

    for (const [name, queue] of this.queues) {
      try {
        // Clean completed jobs older than 1 day
        const completedCleaned = await queue.clean(
          24 * 60 * 60 * 1000, // 1 day
          100, // limit
          'completed',
        );

        // Clean failed jobs older than 7 days
        const failedCleaned = await queue.clean(
          7 * 24 * 60 * 60 * 1000, // 7 days
          50, // limit
          'failed',
        );

        this.logger.log(
          `Cleaned ${name}: ${completedCleaned.length} completed, ${failedCleaned.length} failed jobs`,
        );
      } catch (error) {
        this.logger.error(`Failed to clean queue ${name}:`, error);
      }
    }

    this.logger.log('Queue cleanup completed');
  }

  async manualCleanup(
    queueName: string,
    olderThan: number = 24 * 60 * 60 * 1000,
  ) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [completed, failed] = await Promise.all([
      queue.clean(olderThan, 0, 'completed'),
      queue.clean(olderThan, 0, 'failed'),
    ]);

    return {
      completed: completed.length,
      failed: failed.length,
    };
  }
}
