import { NotificationChannel, NotificationType } from '../../../common';
import { User } from '../../users/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  recipient: User;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column('jsonb', { nullable: true })
  payload?: any;

  @Column({ nullable: true })
  sourceId?: string;

  @Column({ type: 'simple-array', nullable: true })
  channels?: NotificationChannel[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
