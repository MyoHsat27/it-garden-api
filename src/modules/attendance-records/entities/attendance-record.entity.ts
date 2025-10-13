import { Enrollment } from 'src/modules/enrollments/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity('attendance_records')
@Index(['enrollment', 'date'], { unique: true })
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.attendanceRecords)
  enrollment: Enrollment;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  present: boolean;
}
