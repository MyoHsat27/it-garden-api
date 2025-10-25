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
  ) {}

  async create(batch: Partial<Batch>): Promise<Batch> {
    const newBatch = this.repo.create(batch);
    return this.repo.save(newBatch);
  }

  async findAll(): Promise<Batch[]> {
    return this.repo.find({
      relations: ['course', 'teacher', 'classroom', 'enrollments'],
      order: { id: 'DESC' },
    });
  }

  async findWithFilters(
    query: GetBatchesQueryDto,
  ): Promise<PaginatedResponseDto<Batch>> {
    const { page = 1, limit = 10, search, teacherId, studentId } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.teacher', 'teacher')
      .leftJoinAndSelect('batch.classroom', 'classroom')
      .leftJoinAndSelect('batch.course', 'course')
      .leftJoinAndSelect('batch.enrollments', 'enrollments')
      .leftJoinAndSelect('enrollments.student', 'student')
      .leftJoinAndSelect('batch.assignments', 'assignments')
      .leftJoinAndSelect('batch.exams', 'exams')
      .leftJoinAndSelect('batch.timetables', 'timetables')
      .leftJoinAndSelect('timetables.timeSlot', 'timeSlot')
      .leftJoinAndSelect('batch.announcements', 'announcements')
      .orderBy('batch.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(batch.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (studentId) {
      qb.andWhere('(student.id = :id)', {
        id: `${studentId}`,
      });
    }

    if (teacherId) {
      qb.andWhere('(teacher.id = :id)', {
        id: `${teacherId}`,
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
      relations: [
        'course',
        'teacher',
        'classroom',
        'timetables',
        'timetables.timeSlot',
        'enrollments',
        'enrollments.student',
      ],
    });
  }

  async findByTeacherId(id: number): Promise<Batch[]> {
    return this.repo.find({
      where: { teacher: { id } },
      relations: ['course', 'teacher', 'classroom', 'enrollments'],
    });
  }

  async findByName(name: string): Promise<Batch | null> {
    return this.repo.findOne({
      where: { name },
      relations: ['course', 'teacher', 'classroom', 'enrollments'],
    });
  }

  async findExisting(name: string, id?: number): Promise<Batch | null> {
    if (id)
      return this.repo.findOne({
        where: { name, id: Not(id) },
        relations: ['course', 'teacher', 'classroom'],
      });
    else
      return this.repo.findOne({
        where: { name },
        relations: ['course', 'teacher', 'classroom'],
      });
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
