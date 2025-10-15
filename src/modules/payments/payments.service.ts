import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { CreatePaymentDto, PaymentResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { Enrollment } from '../enrollments/entities';
import { EnrollmentsRepository } from '../enrollments/enrollments.repository';
import { PaymentStatus } from '../enrollments/enums';
import { en } from '@faker-js/faker';
import e from 'express';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly repository: PaymentsRepository,
    private readonly enrollmentRepository: EnrollmentsRepository,
  ) {}

  async create(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const enrollment = await this.enrollmentRepository.findById(
      dto.enrollmentId,
    );

    if (!enrollment)
      throw new NotFoundException(
        `Enrollment with ID ${dto.enrollmentId} not found`,
      );

    const payment = await this.repository.create({
      enrollment,
      amount: dto.amount,
      paidAt: new Date(dto.paidAt),
      method: dto.method,
    });

    enrollment.feeStatus = PaymentStatus.PAID;

    await this.enrollmentRepository.save(enrollment);

    return plainToInstance(PaymentResponseDto, { ...payment, enrollment });
  }

  async findAll(): Promise<PaymentResponseDto[]> {
    const payments = await this.repository.findAll();
    return payments.map((p) =>
      plainToInstance(PaymentResponseDto, {
        ...p,
        enrollmentId: p.enrollment.id,
      }),
    );
  }

  async findOne(id: number): Promise<PaymentResponseDto> {
    const payment = await this.repository.findById(id);
    if (!payment)
      throw new NotFoundException(`Payment with id ${id} not found`);
    return plainToInstance(PaymentResponseDto, {
      ...payment,
      enrollmentId: payment.enrollment.id,
    });
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0)
      throw new NotFoundException(`Payment with id ${id} not found`);
  }
}
