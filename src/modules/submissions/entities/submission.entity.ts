import { Assignment } from '../../assignments/entities';
import { Enrollment } from '../../enrollments/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { SubmissionStatus } from '../enums';

@Entity('submissions')
@Index(['assignment', 'enrollment'], { unique: true })
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grade?: number;

  @Column({ nullable: true })
  feedback?: string;

  @Column({ default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  @Column({ type: 'date' })
  submittedAt: Date;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  assignment: Assignment;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.submissions)
  enrollment: Enrollment;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
