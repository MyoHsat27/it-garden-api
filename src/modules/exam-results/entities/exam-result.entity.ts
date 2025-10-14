import { Enrollment } from '../../enrollments/entities';
import { Exam } from '../../exams/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity('exam_results')
@Index(['exam', 'enrollment'], { unique: true })
export class ExamResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exam, (exam) => exam.results)
  exam: Exam;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.examResults)
  enrollment: Enrollment;

  @Column('decimal')
  score: number;
}
