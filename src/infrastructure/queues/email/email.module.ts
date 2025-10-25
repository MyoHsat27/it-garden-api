import { Module } from '@nestjs/common';
import { EmailProducer } from './email.producer';
import { EmailProcessor } from './email.processor';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { EmailService } from './email.service';
import { AnnouncementProducer } from '../announcement';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    BullBoardModule.forFeature({
      name: 'email',
      adapter: BullMQAdapter,
    }),
  ],
  providers: [EmailProducer, EmailProcessor, EmailService],
  exports: [EmailProducer],
})
export class EmailModule {}
