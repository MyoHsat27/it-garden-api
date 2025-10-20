import { NotificationChannel, NotificationType } from '../../../common';
import { User } from '../../users/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity('notification_preferences')
@Unique(['user'])
export class NotificationPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column('jsonb', { default: '{}' })
  byType: { [key in NotificationType]?: NotificationChannel[] };
}
