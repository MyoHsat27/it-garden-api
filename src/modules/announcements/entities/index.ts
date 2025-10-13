import { Batch } from 'src/modules/batches/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => Batch, (batch) => batch.announcements, { nullable: true })
  batch: Batch;
}
