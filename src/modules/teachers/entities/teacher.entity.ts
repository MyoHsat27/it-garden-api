import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Gender } from '../../../common';
import { User } from '../../users/entities';
import { Timetable } from '../../timetables/entities';
import { Batch } from '../../batches/entities';
import { Assignment } from '../../assignments/entities';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.teacherProfile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Batch, (batch) => batch.teachers)
  batches: Batch[];

  @ManyToMany(() => Assignment, (assignment) => assignment.teacher)
  assignments: Assignment[];

  @OneToMany(() => Timetable, (timetable) => timetable.teacher)
  timetables: Timetable[];
}
