import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Learner } from '../../learners/entities';

@Entity('users')
@Index(['email', 'id', 'username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  password: string | null;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  @Exclude()
  refreshToken: string | null;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;

  @Column({ name: 'verify_email_token', type: 'varchar', nullable: true })
  @Exclude()
  verifyEmailToken: string | null;

  @Column({ name: 'verify_email_expires', type: 'timestamp', nullable: true })
  @Exclude()
  verifyEmailExpires: Date | null;

  @Column({ name: 'password_reset_code', type: 'varchar', nullable: true })
  @Exclude()
  passwordResetCode: string | null;

  @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
  @Exclude()
  passwordResetExpires: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  deletedAt: Date;

  @OneToOne(() => Learner, (learner) => learner.user)
  learner: Learner;
}
