import { Enrollment } from '../../enrollments/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Timetable } from '../../timetables/entities';
import { AttendanceRecordStatus } from '../enums/attendance-record-status.enum';

@Entity('attendance_records')
@Index(['enrollment', 'date'], { unique: true })
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.attendanceRecords)
  enrollment: Enrollment;

  @ManyToOne(() => Timetable, { nullable: true })
  timetable?: Timetable;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AttendanceRecordStatus,
    default: AttendanceRecordStatus.SCHEDULED,
  })
  status: AttendanceRecordStatus;

  @Column({ default: false })
  present: boolean;

  @Column({})
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
