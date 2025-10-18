import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAssignmentsQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class AssignmentsRepository {
  constructor(
    @InjectRepository(Assignment)
    private readonly repo: Repository<Assignment>,
  ) {}

  async create(assignment: Partial<Assignment>): Promise<Assignment> {
    const entity = this.repo.create(assignment);
    return this.repo.save(entity);
  }

  async save(assignment: Assignment): Promise<Assignment> {
    return this.repo.save(assignment);
  }

  async findWithFilters(
    query: GetAssignmentsQueryDto,
  ): Promise<PaginatedResponseDto<Assignment>> {
    const logger = new Logger('Test');
    const {
      page = 1,
      limit = 10,
      search,
      batchId,
      teacherId,
      studentId,
    } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.batch', 'batch')
      .leftJoinAndSelect('batch.teacher', 'teacher')
      .orderBy('assignment.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(assignment.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (teacherId) {
      qb.andWhere('teacher.id = :teacherId', { teacherId });
    }

    logger.log(qb);
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

  findAll(): Promise<Assignment[]> {
    return this.repo.find({ relations: ['teacher', 'batch'] });
  }

  findAllByBatch(batchId: number) {
    return this.repo.find({
      where: { batch: { id: batchId } },
      relations: ['teacher', 'batch'],
      order: { startDate: 'DESC' },
    });
  }

  findById(id: number): Promise<Assignment | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'teacher',
        'batch',
        'submissions',
        'submissions.enrollment',
        'submissions.enrollment.student',
      ],
    });
  }

  async update(assignment: Assignment): Promise<Assignment> {
    return this.repo.save(assignment);
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
