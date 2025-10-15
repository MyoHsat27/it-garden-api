import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TimeSlotsRepository } from './time-slots.repository';
import {
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
  TimeSlotResponseDto,
} from './dto';

@Injectable()
export class TimeSlotsService {
  constructor(private readonly repository: TimeSlotsRepository) {}

  async create(dto: CreateTimeSlotDto): Promise<TimeSlotResponseDto> {
    const timeSlot = await this.repository.createTimeSlot(dto);
    return plainToInstance(TimeSlotResponseDto, timeSlot);
  }

  async findAll(): Promise<TimeSlotResponseDto[]> {
    const timeSlots = await this.repository.findAll();
    return plainToInstance(TimeSlotResponseDto, timeSlots);
  }

  async findOne(id: number): Promise<TimeSlotResponseDto> {
    const timeSlot = await this.repository.findById(id);
    return plainToInstance(TimeSlotResponseDto, timeSlot);
  }

  async update(
    id: number,
    dto: UpdateTimeSlotDto,
  ): Promise<TimeSlotResponseDto> {
    const updated = await this.repository.updateTimeSlot(id, dto);
    return plainToInstance(TimeSlotResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    await this.repository.deleteTimeSlot(id);
  }
}
