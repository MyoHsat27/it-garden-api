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

@Entity('submissions')
@Index(['assignment', 'enrollment'], { unique: true })
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  submittedAt: Date;

  @Column({ nullable: true })
  grade: string;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  assignment: Assignment;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.submissions)
  enrollment: Enrollment;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
