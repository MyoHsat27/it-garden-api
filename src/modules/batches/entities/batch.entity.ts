import { Announcement } from 'src/modules/announcements/entities';
import { Assignment } from 'src/modules/assignments/entities';
import { Course } from 'src/modules/courses/entities';
import { Enrollment } from 'src/modules/enrollments/entities';
import { Exam } from 'src/modules/exams/entities';
import { Teacher } from 'src/modules/teachers/entities';
import { Timetable } from 'src/modules/timetables/entities';
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
