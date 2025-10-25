import { forwardRef, Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities';
import { EmailModule } from '../../infrastructure/queues/email';
import { NotificationsModule } from '../notifications/notifications.module';
import { AnnouncementQueueModule } from '../../infrastructure/queues/announcement';
import { Batch } from '../batches/entities';
import { User } from '../users/entities';
import { AnnouncementsRepository } from './announcements.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement, Batch, User]),
    NotificationsModule,
    EmailModule,
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, AnnouncementsRepository],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
