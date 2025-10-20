import { User } from '../../users/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { ChatThread } from './chat-thread.entity';

@Entity('chat_participants')
@Unique(['thread', 'user'])
export class ChatParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatThread)
  thread: ChatThread;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  unreadCount: number;
}
