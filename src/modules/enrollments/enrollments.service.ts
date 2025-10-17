import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
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
import { PaymentsRepository } from '../payments/payments.repository';
import { PaginatedResponseDto, PaymentStatus } from '../../common';
import { GetEnrollmentsQueryDto } from './dto/get-enrollments-query.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly repository: EnrollmentsRepository,
    private readonly studentsRepo: StudentsRepository,
    private readonly batchesRepo: BatchesRepository,
    private readonly paymentsRepo: PaymentsRepository,
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

    if (dto.discountAmount > batch.course.price) {
      throw new BadRequestException('Discount cannot exceed the fee amount');
    }

    const finalFee = batch.course.price - dto.discountAmount;

    const enrollment = await this.repository.save({
      student,
      batch,
      feeAmount: batch.course.price,
      discountAmount: dto.discountAmount,
      finalFee,
      feeStatus: dto.feeStatus,
      dueDate: new Date(dto.dueDate),
    } as any);

    if (dto.feeStatus === PaymentStatus.PAID) {
      await this.paymentsRepo.create({
        amount: enrollment.finalFee,
        paidAt: new Date(),
        paymentMethod: dto.paymentMethod,
        enrollment: enrollment,
      });

      enrollment.feeStatus = PaymentStatus.PAID;

      await this.repository.save(enrollment);
    }

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

  async findAllEnrollmentsWithFilters(query: GetEnrollmentsQueryDto) {
    const result = await this.repository.findWithFilters(query);

    const data = result.data.map((a) =>
      plainToInstance(EnrollmentResponseDto, a),
    );

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
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

    if (dto.enrollmentStatus)
      enrollment.enrollmentStatus = dto.enrollmentStatus;

    const updated = await this.repository.update(enrollment);
    return plainToInstance(EnrollmentResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const enrollment = await this.repository.findById(id);
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
    await this.repository.delete(id);
  }
}
