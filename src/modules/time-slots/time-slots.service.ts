import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TimeSlotsRepository } from './time-slots.repository';
import {
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
  TimeSlotResponseDto,
  GetTimeSlotsQueryDto,
} from './dto';
import { PaginatedResponseDto } from '../../common';

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

  async findAllTimeSlotsWithFilters(query: GetTimeSlotsQueryDto) {
    const result = await this.repository.findWithFilters(query);

    const data = result.data.map((a) =>
      plainToInstance(TimeSlotResponseDto, a),
    );

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
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
