import { Batch } from '../../batches/entities';
import { ExamResult } from '../../exam-results/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date' })
  examDate: Date;

  @ManyToOne(() => Batch, (batch) => batch.exams)
  batch: Batch;

  @OneToMany(() => ExamResult, (result) => result.exam)
  results: ExamResult[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
