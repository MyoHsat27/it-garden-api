import { PaymentMethod } from '../../../common';
import { Enrollment } from '../../enrollments/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  paidAt: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
    name: 'payment_method',
  })
  paymentMethod: PaymentMethod;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Enrollment, (enrollment) => enrollment.payment, {
    cascade: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;
}
