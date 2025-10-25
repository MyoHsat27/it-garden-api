import { forwardRef, Module } from '@nestjs/common';
import { AnnouncementProducer } from './announcement.producer';
import { AnnouncementProcessor } from './announcement.processor';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { AnnouncementsModule } from '../../../modules/announcements/announcements.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'announcement',
    }),
    BullBoardModule.forFeature({
      name: 'announcement',
      adapter: BullMQAdapter,
    }),
    forwardRef(() => AnnouncementsModule),
  ],
  providers: [AnnouncementProducer, AnnouncementProcessor],
  exports: [AnnouncementProducer, AnnouncementProcessor],
})
export class AnnouncementQueueModule {}
