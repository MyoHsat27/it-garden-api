import { Enrollment } from 'src/modules/enrollments/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.payments)
  enrollment: Enrollment;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  paidAt: Date;

  @Column()
  method: string;
}
