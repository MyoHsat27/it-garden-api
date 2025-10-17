import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { GetAdminsQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
  ) {}

  create(data: Partial<Admin>) {
    return this.repo.create(data);
  }

  save(admin: Admin) {
    return this.repo.save(admin);
  }

  findAll() {
    return this.repo.find({
      relations: ['user', 'role'],
      order: { id: 'DESC' },
    });
  }

  async findWithFilters(
    query: GetAdminsQueryDto,
  ): Promise<PaginatedResponseDto<Admin>> {
    const { page = 1, limit = 10, search, role } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.user', 'user')
      .leftJoinAndSelect('admin.role', 'role')
      .orderBy('admin.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(admin.fullName ILIKE :search OR user.email ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (role) {
      qb.andWhere('role.id = :role', { role });
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
      relations: ['user', 'role'],
    });
  }

  async findCountByRoleId(roleId: number): Promise<number> {
    return this.repo
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .where('role.id = :roleId', { roleId })
      .getCount();
  }

  async deleteAdmin(id: number) {
    const admin = await this.findById(id);
    if (admin) await this.repo.remove(admin);
  }

  async softDeleteAdmin(id: number) {
    const admin = await this.findById(id);
    if (admin) await this.repo.softRemove(admin);
  }
}
