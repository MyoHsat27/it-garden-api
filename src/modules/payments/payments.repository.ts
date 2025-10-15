import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

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
      order: { createdAt: 'DESC' },
      relations: ['enrollment'],
    });
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
