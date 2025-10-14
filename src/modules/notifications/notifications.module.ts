import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailModule } from '../../infrastructure/queues/email';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), EmailModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
