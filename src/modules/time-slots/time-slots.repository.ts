import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import {
  CreateTimeSlotDto,
  GetTimeSlotsQueryDto,
  UpdateTimeSlotDto,
} from './dto';
import { PaginatedResponseDto } from '../../common';

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

  async findWithFilters(
    query: GetTimeSlotsQueryDto,
  ): Promise<PaginatedResponseDto<TimeSlot>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('timeSlot')
      .orderBy('timeSlot.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(timeSlot.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, totalItems] = await qb.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      data,
      page,
      limit,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
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
