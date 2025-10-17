import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';
import { GetClassroomsQueryDto } from './dto/get-classrooms-query.dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class ClassroomsRepository {
  constructor(
    @InjectRepository(Classroom)
    private readonly repo: Repository<Classroom>,
  ) {}

  async create(Classroom: Partial<Classroom>): Promise<Classroom> {
    const entity = this.repo.create(Classroom);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Classroom[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findWithFilters(
    query: GetClassroomsQueryDto,
  ): Promise<PaginatedResponseDto<Classroom>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.timetables', 'timetables')
      .orderBy('classroom.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(classroom.name ILIKE :search)', {
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

  async findById(id: number): Promise<Classroom | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(classroom: Classroom): Promise<Classroom> {
    return this.repo.save(classroom);
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
