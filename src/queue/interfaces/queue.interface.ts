import { Job } from 'bullmq';

export interface BaseJobData {
  id?: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

export interface QueueProcessor<T = any> {
  process(job: Job<T>): Promise<any>;
}

export interface QueueEventHandlers {
  onCompleted?(job: Job, result: any): Promise<void>;
  onFailed?(job: Job, error: Error): Promise<void>;
  onActive?(job: Job): Promise<void>;
  onWaiting?(job: Job): Promise<void>;
  onStalled?(job: Job): Promise<void>;
}
