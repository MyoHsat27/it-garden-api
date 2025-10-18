import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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
    return this.repo.find({ order: { id: 'DESC' } });
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

  async findById(id: number): Promise<TimeSlot | null> {
    return this.repo.findOne({ where: { id }, relations: ['timetables'] });
  }

  async findByName(name: string): Promise<TimeSlot | null> {
    return this.repo.findOne({ where: { name } });
  }

  async findExisting(name: string, id?: number): Promise<TimeSlot | null> {
    if (id)
      return this.repo.findOne({
        where: { name, id: Not(id) },
        relations: ['timetables'],
      });
    else
      return this.repo.findOne({ where: { name }, relations: ['timetables'] });
  }

  async update(timeSlot: TimeSlot): Promise<TimeSlot> {
    return this.repo.save(timeSlot);
  }

  async delete(id: number): Promise<number> {
    const timeSlot = await this.findById(id);
    if (!timeSlot) {
      throw new NotFoundException('Time Slot not found');
    }

    if (timeSlot.timetables && timeSlot.timetables.length > 0) {
      throw new BadRequestException(
        'Cannot delete time slot because it is used.',
      );
    }
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
