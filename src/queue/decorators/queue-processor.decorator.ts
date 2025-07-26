import { SetMetadata } from '@nestjs/common';

export const QUEUE_PROCESSOR = 'QUEUE_PROCESSOR';

export interface QueueProcessorOptions {
  name: string;
  concurrency?: number;
}

export const QueueProcessor = (options: QueueProcessorOptions) =>
  SetMetadata(QUEUE_PROCESSOR, options);
