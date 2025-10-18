import { Batch } from '../../batches/entities';
import { Classroom } from '../../classrooms/entities';
import { Teacher } from '../../teachers/entities';
import { TimeSlot } from '../../time-slots/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('timetables')
export class Timetable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number;

  @ManyToOne(() => Batch, (batch) => batch.timetables, { onDelete: 'CASCADE' })
  batch: Batch;

  @ManyToOne(() => Classroom, (classroom) => classroom.timetables)
  classroom: Classroom;

  @ManyToOne(() => Teacher, (teacher) => teacher.timetables)
  teacher: Teacher;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.timetables)
  timeSlot: TimeSlot;
}
