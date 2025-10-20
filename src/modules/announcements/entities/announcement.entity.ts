import { Batch } from '../../batches/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities';
import { NotificationChannel } from '../../../common';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  @Column('text')
  body: string;

  @ManyToOne(() => Batch, (batch) => batch.announcements, { nullable: true })
  batch?: Batch;
  @Column({ type: 'simple-array', nullable: true })
  channels: NotificationChannel[];

  @ManyToOne(() => User, { nullable: false })
  author: User;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  publishAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
