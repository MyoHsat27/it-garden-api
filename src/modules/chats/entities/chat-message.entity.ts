import { User } from '../../users/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ChatThread } from './chat-thread.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatThread)
  thread: ChatThread;

  @ManyToOne(() => User)
  author: User;

  @Column('text')
  body: string;

  @CreateDateColumn() createdAt: Date;
}
