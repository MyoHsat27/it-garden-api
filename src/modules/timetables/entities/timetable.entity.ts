import { Batch } from '../../batches/entities';
import { Classroom } from '../../classrooms/entities';
import { Teacher } from '../../teachers/entities';
import { TimeSlot } from '../../time-slots/entities';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('timetables')
export class Timetable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Batch, (batch) => batch.timetables)
  batch: Batch;

  @ManyToOne(() => Classroom, (classroom) => classroom.timetables)
  classroom: Classroom;

  @ManyToOne(() => Teacher, (teacher) => teacher.timetables)
  teacher: Teacher;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.timetables)
  timeSlot: TimeSlot;
}
