import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './entities';

@Injectable()
export class TimetablesRepository {
  constructor(
    @InjectRepository(Timetable)
    private readonly repo: Repository<Timetable>,
  ) {}

  async save(timetable: Timetable): Promise<Timetable> {
    return this.repo.save(timetable);
  }

  async findAll(): Promise<Timetable[]> {
    return this.repo.find({
      relations: ['batch', 'teacher', 'classroom', 'timeSlot'],
    });
  }

  async findById(id: number): Promise<Timetable | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['batch', 'teacher', 'classroom', 'timeSlot'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // Optional helper to check conflicts, but no exceptions thrown here
  async findConflict(
    batchId: number,
    teacherId: number,
    classroomId: number,
    timeSlotId: number,
  ): Promise<Timetable | null> {
    return this.repo.findOne({
      where: [
        { batch: { id: batchId }, timeSlot: { id: timeSlotId } },
        { teacher: { id: teacherId }, timeSlot: { id: timeSlotId } },
        { classroom: { id: classroomId }, timeSlot: { id: timeSlotId } },
      ],
      relations: ['batch', 'teacher', 'classroom', 'timeSlot'],
    });
  }
}
