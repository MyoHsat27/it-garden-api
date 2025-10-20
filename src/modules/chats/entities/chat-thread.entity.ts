import { ChatThreadType } from '../../../common';
import { Batch } from '../../batches/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChatParticipant } from './chat-participant.entity';

@Entity('chat_threads')
export class ChatThread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ChatThreadType })
  type: ChatThreadType;

  @Column({ nullable: true })
  title?: string;

  @ManyToOne(() => Batch, { nullable: true })
  batch?: Batch;

  @OneToMany(() => ChatParticipant, (p) => p.thread, { cascade: true })
  participants: ChatParticipant[];

  @CreateDateColumn() createdAt: Date;
}
