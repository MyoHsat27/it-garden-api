import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  async create(payment: Partial<Payment>): Promise<Payment> {
    const entity = this.repo.create(payment);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Payment[]> {
    return this.repo.find({
      order: { id: 'DESC' },
      relations: ['enrollment'],
    });
  }

  async findWithFilters(
    query: GetPaymentsQueryDto,
  ): Promise<PaginatedResponseDto<Payment>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.enrollment', 'enrollment')
      .orderBy('payment.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(payment.name ILIKE :search)', {
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

  async findById(id: number): Promise<Payment | null> {
    return this.repo.findOne({ where: { id }, relations: ['enrollment'] });
  }

  async update(payment: Payment): Promise<Payment> {
    return this.repo.save(payment);
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
