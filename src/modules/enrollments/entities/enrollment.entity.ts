import { AttendanceRecord } from '../../attendance-records/entities';
import { Batch } from '../../batches/entities';
import { ExamResult } from '../../exam-results/entities';
import { Payment } from '../../payments/entities';
import { Student } from '../../students/entities';
import { Submission } from '../../submissions/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EnrollmentStatus } from '../enums';
import { PaymentStatus } from '../../../common';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { name: 'fee_amount', precision: 10, scale: 2 })
  feeAmount: number;

  @Column('decimal', {
    name: 'discount_amount',
    precision: 10,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column('decimal', { name: 'final_fee', precision: 10, scale: 2 })
  finalFee: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    name: 'fee_status',
  })
  feeStatus: PaymentStatus;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
    name: 'enrollment_status',
  })
  enrollmentStatus: EnrollmentStatus;

  @Column()
  studentId: number;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @Column()
  batchId: number;

  @ManyToOne(() => Batch, (batch) => batch.enrollments, { onDelete: 'CASCADE' })
  batch: Batch;

  @OneToMany(() => AttendanceRecord, (record) => record.enrollment)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => Submission, (submission) => submission.enrollment)
  submissions: Submission[];

  @OneToMany(() => ExamResult, (result) => result.enrollment)
  examResults: ExamResult[];

  @OneToOne(() => Payment, (payment) => payment.enrollment, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  payment?: Payment | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
