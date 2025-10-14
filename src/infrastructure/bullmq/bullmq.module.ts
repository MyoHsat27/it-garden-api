import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { bullMqAsyncConfig } from '../../config';

@Global()
@Module({
  imports: [BullModule.forRootAsync(bullMqAsyncConfig)],
})
export class BullMQModule {}
