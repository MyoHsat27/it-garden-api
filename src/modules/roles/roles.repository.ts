import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { GetRolesQueryDto } from './dto/get-roles-query.dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  create(data: Partial<Role>) {
    return this.repo.create(data);
  }

  save(role: Role) {
    return this.repo.save(role);
  }

  findAll() {
    return this.repo.find({
      relations: ['permissions'],
      order: { id: 'DESC' },
    });
  }

  async findWithFilters(
    query: GetRolesQueryDto,
  ): Promise<PaginatedResponseDto<Role>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'user')
      .orderBy('role.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(role.name ILIKE :search)', {
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

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  findByName(name: string) {
    return this.repo.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  async deleteRole(id: number) {
    const role = await this.findById(id);
    if (role) await this.repo.remove(role);
  }
}
