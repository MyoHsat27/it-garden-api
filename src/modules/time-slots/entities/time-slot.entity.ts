import { Timetable } from '../../timetables/entities';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @OneToMany(() => Timetable, (timetable) => timetable.timeSlot)
  timetables: Timetable[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
