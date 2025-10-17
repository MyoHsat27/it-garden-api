import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { GetCoursesQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
  ) {}

  async create(course: Partial<Course>): Promise<Course> {
    const entity = this.repo.create(course);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Course[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findWithFilters(
    query: GetCoursesQueryDto,
  ): Promise<PaginatedResponseDto<Course>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('course')
      .orderBy('course.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(course.name ILIKE :search)', {
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

  async findById(id: number): Promise<Course | null> {
    return this.repo.findOne({ where: { id }, relations: ['batches'] });
  }

  async findByName(name: string): Promise<Course | null> {
    return this.repo.findOne({ where: { name }, relations: ['batches'] });
  }

  async findExisting(name: string, id?: number): Promise<Course | null> {
    if (id)
      return this.repo.findOne({
        where: { name, id: Not(id) },
        relations: ['batches'],
      });
    else return this.repo.findOne({ where: { name }, relations: ['batches'] });
  }

  async update(course: Course): Promise<Course> {
    return this.repo.save(course);
  }

  async delete(id: number): Promise<number> {
    const course = await this.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.batches && course.batches.length > 0) {
      throw new BadRequestException(
        'Cannot delete course because it is used by one or more batches.',
      );
    }
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
