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
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Course, (course) => course.batches, { onDelete: 'CASCADE' })
  course: Course;

  @ManyToMany(() => Teacher, (teacher) => teacher.batches)
  @JoinTable({
    name: 'batch_teachers',
    joinColumn: { name: 'batch_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
  })
  teachers: Teacher[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.batch)
  enrollments: Enrollment[];

  @OneToMany(() => Assignment, (assignment) => assignment.batch)
  assignments: Assignment[];

  @OneToMany(() => Exam, (exam) => exam.batch)
  exams: Exam[];

  @OneToMany(() => Timetable, (timetable) => timetable.batch)
  timetables: Timetable[];

  @OneToMany(() => Announcement, (announcement) => announcement.batch)
  announcements: Announcement[];
}
