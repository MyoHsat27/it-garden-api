import { Batch } from 'src/modules/batches/entities';
import { Classroom } from 'src/modules/classrooms/entities';
import { Teacher } from 'src/modules/teachers/entities';
import { TimeSlot } from 'src/modules/timeslots/entities';
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
