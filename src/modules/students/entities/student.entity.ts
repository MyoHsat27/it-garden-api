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
  Index,
} from 'typeorm';
import { Gender } from '../../../common';
import { User } from '../../users/entities';
import { Enrollment } from '../../enrollments/entities';
import { StudentStatus } from '../enums';

@Entity('students')
@Index(['registrationNumber'], { unique: true })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'registration_number' })
  registrationNumber: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ name: 'guardian_name', type: 'varchar' })
  guardianName: string;

  @Column({ name: 'guardian_contact', type: 'varchar' })
  guardianContact: string;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.studentProfile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
