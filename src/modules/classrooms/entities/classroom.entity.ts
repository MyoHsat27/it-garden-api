import { Batch } from '../../batches/entities';
import { Exam } from '../../exams/entities';
import { Timetable } from '../../timetables/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  capacity: number;

  @OneToMany(() => Timetable, (timetable) => timetable.classroom)
  timetables: Timetable[];

  @OneToMany(() => Batch, (batch) => batch.classroom)
  batches: Batch[];

  @OneToMany(() => Exam, (exam) => exam.classroom)
  exams: Exam[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
