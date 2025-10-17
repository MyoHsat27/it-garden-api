import { Batch } from '../../batches/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, default: null })
  duration: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => Batch, (batch) => batch.course)
  batches: Batch[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
