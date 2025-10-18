import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { GetEnrollmentsQueryDto } from './dto/get-enrollments-query.dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class EnrollmentsRepository {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
  ) {}

  async save(enrollment: Enrollment): Promise<Enrollment> {
    return this.repo.save(enrollment);
  }

  findAll(): Promise<Enrollment[]> {
    return this.repo.find({ relations: ['student', 'batch'] });
  }

  async findWithFilters(
    query: GetEnrollmentsQueryDto,
  ): Promise<PaginatedResponseDto<Enrollment>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.batch', 'batch')
      .leftJoinAndSelect('batch.course', 'course')
      .leftJoinAndSelect('enrollment.payment', 'payment')
      .orderBy('enrollment.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(enrollment.name ILIKE :search)', {
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

  findById(id: number): Promise<Enrollment | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['student', 'batch', 'batch.course', 'payment'],
    });
  }

  async update(enrollment: Enrollment): Promise<Enrollment> {
    return this.repo.save(enrollment);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findByStudentAndBatch(
    studentId: number,
    batchId: number,
  ): Promise<Enrollment | null> {
    return this.repo.findOne({
      where: { student: { id: studentId }, batch: { id: batchId } },
    });
  }
}
