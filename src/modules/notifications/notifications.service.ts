import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationChannel, NotificationType } from '../../common';
import { plainToInstance } from 'class-transformer';
import { NotificationResponseDto } from './dot/notification-response.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly gateway: NotificationsGateway,
  ) {}

  async createForUser(
    user: User,
    payload: {
      title: string;
      body: string;
      type?: NotificationType | string;
      channels?: NotificationChannel[];
      payloadData?: any;
      sourceId?: number;
    },
  ) {
    this.logger.log('SENDING WEB');
    const n = this.notificationRepo.create({
      recipient: user,
      title: payload.title,
      body: payload.body,
      type: (payload.type as NotificationType) ?? NotificationType.CUSTOM,
      payload: payload.payloadData,
      sourceId: payload.sourceId,
      channels: payload.channels ?? [NotificationChannel.WEB],
      read: false,
    });

    const saved = await this.notificationRepo.save(n);

    try {
      this.gateway.emitToUser(user.id, 'notification', saved);
    } catch (err) {
      this.logger.warn(
        `Failed to emit notification to user ${user.id}: ${err.message}`,
      );
    }

    return saved;
  }

  async createForUsers(users: User[], payload: any) {
    return Promise.all(users.map((u) => this.createForUser(u, payload)));
  }

  async findByUser(user: User) {
    const notifications = this.notificationRepo.find({
      where: { recipient: { id: user.id } },
      relations: ['recipient'],
    });

    return plainToInstance(NotificationResponseDto, notifications);
  }

  async markAsRead(id: number, user: User) {
    await this.notificationRepo.update(
      { id, recipient: { id: user.id } },
      { read: true },
    );
    const notification = await this.notificationRepo.findOne({ where: { id } });

    return plainToInstance(NotificationResponseDto, notification);
  }
}
