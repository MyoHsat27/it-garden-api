import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EnrollmentsRepository } from './enrollments.repository';
import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
  EnrollmentResponseDto,
} from './dto';
import { StudentsRepository } from '../students/students.repository';
import { BatchesRepository } from '../batches/batches.repository';
import { PaymentStatus } from './enums';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly repository: EnrollmentsRepository,
    private readonly studentsRepo: StudentsRepository,
    private readonly batchesRepo: BatchesRepository,
  ) {}

  async create(dto: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    const student = await this.studentsRepo.findById(dto.studentId);
    if (!student)
      throw new NotFoundException(`Student ${dto.studentId} not found`);

    const batch = await this.batchesRepo.findById(dto.batchId);
    if (!batch) throw new NotFoundException(`Batch ${dto.batchId} not found`);

    const existing = await this.repository.findByStudentAndBatch(
      dto.studentId,
      dto.batchId,
    );
    if (existing)
      throw new BadRequestException('Student already enrolled in this batch');

    const enrollment = await this.repository.save({
      student,
      batch,
      feeAmount: batch.course.price,
      discountAmount: dto.discountAmount,
      finalFee: batch.course.price - dto.discountAmount,
      feeStatus: PaymentStatus.PENDING,
      dueDate: new Date(dto.dueDate),
    } as any);

    return plainToInstance(EnrollmentResponseDto, {
      ...enrollment,
      studentId: student.id,
      batchId: batch.id,
    });
  }

  async findAll(): Promise<EnrollmentResponseDto[]> {
    const enrollments = await this.repository.findAll();
    return enrollments.map((e) =>
      plainToInstance(EnrollmentResponseDto, {
        ...e,
        studentId: e.student.id,
        batchId: e.batch.id,
      }),
    );
  }

  async findOne(id: number): Promise<EnrollmentResponseDto> {
    const enrollment = await this.repository.findById(id);
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
    return plainToInstance(EnrollmentResponseDto, {
      ...enrollment,
      studentId: enrollment.student.id,
      batchId: enrollment.batch.id,
    });
  }

  async update(
    id: number,
    dto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    const enrollment = await this.repository.findById(id);
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);

    if (dto.feeStatus) enrollment.feeStatus = dto.feeStatus;
    if (dto.dueDate) enrollment.dueDate = new Date(dto.dueDate);

    const updated = await this.repository.update(enrollment);
    return plainToInstance(EnrollmentResponseDto, {
      ...updated,
      studentId: updated.student.id,
      batchId: updated.batch.id,
    });
  }

  async remove(id: number): Promise<void> {
    const enrollment = await this.repository.findById(id);
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
    await this.repository.delete(id);
  }
}
