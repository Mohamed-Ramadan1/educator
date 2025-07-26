import { JobsOptions } from 'bullmq';

export interface QueueConfig {
  name: string;
  concurrency?: number;
  defaultJobOptions?: JobsOptions;
  settings?: {
    stalledInterval?: number;
    maxStalledCount?: number;
  };
}

export const QUEUE_CONFIGS: Record<string, QueueConfig> = {
  EMAIL: {
    name: 'email-queue',
    concurrency: 5,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  },
  FILE_PROCESSING: {
    name: 'file-processing-queue',
    concurrency: 2,
    defaultJobOptions: {
      attempts: 2,
      backoff: { type: 'fixed', delay: 10000 },
      removeOnComplete: 50,
      removeOnFail: 25,
    },
  },
  NOTIFICATION: {
    name: 'notification-queue',
    concurrency: 10,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 200,
      removeOnFail: 100,
    },
  },
  ANALYTICS: {
    name: 'analytics-queue',
    concurrency: 3,
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: 1000,
      removeOnFail: 100,
      delay: 5000, // Process analytics with slight delay
    },
  },
  USER_ACTIVITY: {
    name: 'user-activity-queue',
    concurrency: 8,
    defaultJobOptions: {
      attempts: 2,
      backoff: { type: 'fixed', delay: 3000 },
      removeOnComplete: 500,
      removeOnFail: 200,
    },
  },
};

export const QUEUE_PRIORITIES = {
  CRITICAL: 1,
  HIGH: 2,
  NORMAL: 3,
  LOW: 4,
  BACKGROUND: 5,
} as const;
