import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities';
import { GetTeachersQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class TeachersRepository {
  constructor(
    @InjectRepository(Teacher)
    private readonly repo: Repository<Teacher>,
  ) {}

  create(data: Partial<Teacher>) {
    return this.repo.create(data);
  }

  save(teacher: Teacher) {
    return this.repo.save(teacher);
  }

  findAll() {
    return this.repo.find({
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'batches'],
    });
  }

  async findWithFilters(
    query: GetTeachersQueryDto,
  ): Promise<PaginatedResponseDto<Teacher>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .orderBy('teacher.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(teacher.fullName ILIKE :search OR user.email ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
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

  async deleteTeacher(id: number) {
    const teacher = await this.findById(id);
    if (teacher) await this.repo.remove(teacher);
  }

  async softDeleteTeacher(id: number) {
    const teacher = await this.findById(id);
    const logger = new Logger('TEST');
    logger.log(teacher);
    if (teacher) await this.repo.softRemove(teacher);
  }
}
