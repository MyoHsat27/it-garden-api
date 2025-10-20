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
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SubmissionStatus } from '../enums';
import { Media } from '../../medias/entities';

@Entity('submissions')
@Index(['assignment', 'enrollment'], { unique: true })
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ nullable: true })
  grade?: string;

  @Column({ nullable: true })
  feedback?: string;

  @Column({ default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  @Column({ type: 'date' })
  submittedAt: Date;

  @Column()
  assignmentId: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  assignment: Assignment;

  @Column()
  enrollmentId: number;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.submissions)
  enrollment: Enrollment;

  @OneToOne(() => Media, (media) => media.submission, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'media_id' })
  media?: Media | null;

  @Column({ name: 'media_id', nullable: true })
  mediaId?: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
