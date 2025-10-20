import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAssignmentsQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';
import { Submission } from '../submissions/entities';

@Injectable()
export class AssignmentsRepository {
  constructor(
    @InjectRepository(Assignment)
    private readonly repo: Repository<Assignment>,

    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
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
      .leftJoinAndSelect('batch.course', 'course')
      .leftJoinAndSelect('batch.enrollments', 'enrollments')
      .leftJoinAndSelect('enrollments.student', 'student')
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

    if (studentId) {
      qb.andWhere('student.id = :studentId', { studentId });
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

  // async findWithStudentFilters(
  //   query: GetAssignmentsQueryDto,
  // ): Promise<PaginatedResponseDto<Assignment>> {
  //   const { page = 1, limit = 10, search, studentId } = query;
  //   const skip = (page - 1) * limit;

  //   const qb = this.repo
  //     .createQueryBuilder('assignment')
  //     .leftJoin('assignment.batch', 'batch')
  //     .leftJoin('batch.teacher', 'teacher')
  //     .leftJoin('batch.course', 'course')
  //     .leftJoin('batch.enrollments', 'enrollments')
  //     .leftJoin('enrollments.student', 'student')
  //     .leftJoin(
  //       'assignment.submissions',
  //       'submissions',
  //       'submissions.enrollmentId = enrollments.id AND enrollments.studentId = :studentId',
  //       { studentId },
  //     )

  //     .select([
  //       'assignment.id',
  //       'assignment.title',
  //       'assignment.description',
  //       'assignment.startDate',
  //       'assignment.dueDate',
  //       'batch.id',
  //       'batch.name',
  //       'course.id',
  //       'course.name',
  //     ])
  //     .addSelect('COUNT(submissions.id)', 'submissionCount')

  //     .groupBy('assignment.id')
  //     .addGroupBy('batch.id')
  //     .addGroupBy('course.id')
  //     .orderBy('assignment.id', 'DESC')
  //     .skip(skip)
  //     .take(limit);

  //   if (search) {
  //     qb.andWhere('(assignment.title ILIKE :search)', {
  //       search: `%${search}%`,
  //     });
  //   }

  //   if (studentId) {
  //     qb.andWhere('student.id = :studentId', { studentId });
  //   }

  //   const [assignments, totalItems] = await qb.getManyAndCount();

  //   const dataWithFlags = assignments.map((a: any) => ({
  //     ...a,
  //     hasSubmission: Number((a as any).submissionCount ?? 0) > 0,
  //   }));

  //   const totalPages = Math.ceil(totalItems / limit);
  //   const hasPreviousPage = page > 1;
  //   const hasNextPage = page < totalPages;

  //   return {
  //     data: dataWithFlags,
  //     page,
  //     limit,
  //     totalItems,
  //     totalPages,
  //     hasPreviousPage,
  //     hasNextPage,
  //   };
  // }

  async findWithStudentFilters(
    query: GetAssignmentsQueryDto,
  ): Promise<PaginatedResponseDto<Assignment>> {
    const { page = 1, limit = 10, search, studentId } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.batch', 'batch')
      .leftJoinAndSelect('batch.teacher', 'teacher')
      .leftJoinAndSelect('batch.course', 'course')
      .leftJoinAndSelect('assignment.media', 'assignmentMedia')
      .leftJoin(
        'batch.enrollments',
        'enrollment',
        'enrollment.studentId = :studentId',
        { studentId },
      )
      .leftJoinAndSelect(
        'assignment.submissions',
        'submission',
        'submission.enrollmentId = enrollment.id',
      )
      .leftJoinAndSelect('submission.media', 'submissionMedia')
      .select([
        'assignment',
        'batch.id',
        'batch.name',
        'course.id',
        'course.name',
        'teacher.id',
        'teacher.fullName',
        'assignmentMedia.id',
        'assignmentMedia.url',
        'submission.id',
        'submission.status',
        'submission.grade',
        'submission.submittedAt',
        'submissionMedia.id',
        'submissionMedia.url',
      ])
      .where('enrollment.id IS NOT NULL')
      .orderBy('assignment.dueDate', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('assignment.title ILIKE :search', { search: `%${search}%` });
    }

    const [assignments, totalItems] = await qb.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      data: assignments,
      page,
      limit,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  }

  findAll(): Promise<Assignment[]> {
    return this.repo.find({ relations: ['batch', 'batch.teacher'] });
  }

  findAllByBatch(batchId: number) {
    return this.repo.find({
      where: { batch: { id: batchId } },
      relations: ['batch', 'batch.teacher'],
      order: { startDate: 'DESC' },
    });
  }

  findById(id: number): Promise<Assignment | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'media',
        'batch',
        'batch.teacher',
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
