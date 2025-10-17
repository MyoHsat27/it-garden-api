import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Batch } from './entities/batch.entity';
import { Course } from '../courses/entities/course.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { GetBatchesQueryDto } from './dto/get-batches-query.dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class BatchesRepository {
  constructor(
    @InjectRepository(Batch)
    private readonly repo: Repository<Batch>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async create(batch: Partial<Batch>): Promise<Batch> {
    const newBatch = this.repo.create(batch);
    return this.repo.save(newBatch);
  }

  async findAll(): Promise<Batch[]> {
    return this.repo.find({
      relations: ['course', 'teacher'],
      order: { id: 'DESC' },
    });
  }

  async findWithFilters(
    query: GetBatchesQueryDto,
  ): Promise<PaginatedResponseDto<Batch>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.teacher', 'teacher')
      .leftJoinAndSelect('batch.course', 'course')
      .leftJoinAndSelect('batch.enrollments', 'enrollments')
      .leftJoinAndSelect('batch.assignments', 'assignments')
      .leftJoinAndSelect('batch.exams', 'exams')
      .leftJoinAndSelect('batch.timetables', 'timetables')
      .leftJoinAndSelect('batch.announcements', 'announcements')
      .orderBy('batch.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(batch.name ILIKE :search)', {
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

  async findById(id: number): Promise<Batch | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['course', 'teacher'],
    });
  }

  async findByName(name: string): Promise<Batch | null> {
    return this.repo.findOne({
      where: { name },
      relations: ['course', 'teacher'],
    });
  }

  async findExisting(name: string, id?: number): Promise<Batch | null> {
    if (id)
      return this.repo.findOne({
        where: { name, id: Not(id) },
        relations: ['course', 'teacher'],
      });
    else
      return this.repo.findOne({
        where: { name },
        relations: ['course', 'teacher'],
      });
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }

  async findCourseById(id: number): Promise<Course | null> {
    return this.courseRepo.findOne({ where: { id } });
  }

  async findTeacherById(id: number): Promise<Teacher | null> {
    return this.teacherRepo.findOneBy({ id });
  }
}
