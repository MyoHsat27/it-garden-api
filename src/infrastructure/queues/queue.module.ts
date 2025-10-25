import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { AnnouncementQueueModule } from './announcement';

@Module({
  imports: [EmailModule, AnnouncementQueueModule],
  exports: [EmailModule, AnnouncementQueueModule],
})
export class QueuesModule {}
