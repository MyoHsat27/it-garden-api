import { Timetable } from '../../timetables/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @OneToMany(() => Timetable, (timetable) => timetable.timeSlot)
  timetables: Timetable[];
}
