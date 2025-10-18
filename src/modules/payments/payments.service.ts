import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { CreatePaymentDto, PaymentResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { EnrollmentsRepository } from '../enrollments/enrollments.repository';
import { PaginatedResponseDto, PaymentStatus } from '../../common';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';
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
      paymentMethod: dto.paymentMethod,
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

  async findAllPaymentsWithFilters(query: GetPaymentsQueryDto) {
    const result = await this.repository.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(PaymentResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
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
