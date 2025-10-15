import { Batch } from '../../batches/entities';
import { Submission } from '../../submissions/entities/submission.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ nullable: true })
  attachmentUrl?: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignments)
  teacher: Teacher;

  @ManyToOne(() => Batch, (batch) => batch.assignments, { onDelete: 'CASCADE' })
  batch: Batch;

  @OneToMany(() => Submission, (submission) => submission.assignment)
  submissions: Submission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
