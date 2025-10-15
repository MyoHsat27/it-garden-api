import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto';

@Injectable()
export class TimeSlotsRepository {
  constructor(
    @InjectRepository(TimeSlot) private readonly repo: Repository<TimeSlot>,
  ) {}

  async createTimeSlot(dto: CreateTimeSlotDto): Promise<TimeSlot> {
    const timeSlot = this.repo.create(dto);
    return this.repo.save(timeSlot);
  }

  async findAll(): Promise<TimeSlot[]> {
    return this.repo.find({ order: { dayOfWeek: 'ASC', startTime: 'ASC' } });
  }

  async findById(id: number): Promise<TimeSlot> {
    const timeSlot = await this.repo.findOne({ where: { id } });
    if (!timeSlot)
      throw new NotFoundException(`TimeSlot with id ${id} not found`);
    return timeSlot;
  }

  async updateTimeSlot(id: number, dto: UpdateTimeSlotDto): Promise<TimeSlot> {
    const timeSlot = await this.findById(id);
    Object.assign(timeSlot, dto);
    return this.repo.save(timeSlot);
  }

  async deleteTimeSlot(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`TimeSlot with id ${id} not found`);
  }
}
