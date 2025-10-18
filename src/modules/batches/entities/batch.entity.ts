import { Announcement } from '../../announcements/entities';
import { Assignment } from '../../assignments/entities';
import { Course } from '../../courses/entities';
import { Enrollment } from '../../enrollments/entities';
import { Exam } from '../../exams/entities';
import { Teacher } from '../../teachers/entities';
import { Timetable } from '../../timetables/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BatchStatus } from '../enums';
import { Classroom } from '../../classrooms/entities';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: BatchStatus,
    default: BatchStatus.FUTURE,
  })
  status: BatchStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Course, (course) => course.batches, { onDelete: 'CASCADE' })
  course: Course;

  @ManyToOne(() => Teacher, (teacher) => teacher.batches, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  teacher: Teacher;

  @ManyToOne(() => Classroom, (classroom) => classroom.batches, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  classroom: Classroom;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.batch)
  enrollments: Enrollment[];

  @OneToMany(() => Assignment, (assignment) => assignment.batch)
  assignments: Assignment[];

  @OneToMany(() => Exam, (exam) => exam.batch)
  exams: Exam[];

  @OneToMany(() => Timetable, (timetable) => timetable.batch, {
    cascade: true,
    eager: true,
  })
  timetables: Timetable[];

  @OneToMany(() => Announcement, (announcement) => announcement.batch)
  announcements: Announcement[];
}
