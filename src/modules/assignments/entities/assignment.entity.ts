import { Batch } from '../../batches/entities';
import { Submission } from '../../submissions/entities/submission.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Media } from '../../medias/entities';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @ManyToOne(() => Batch, (batch) => batch.assignments, { onDelete: 'CASCADE' })
  batch: Batch;

  @OneToOne(() => Media, (media) => media.assignment, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'media_id' })
  media?: Media | null;

  @OneToMany(() => Submission, (submission) => submission.assignment)
  submissions: Submission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
