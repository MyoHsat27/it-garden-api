import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities';
import { GetStudentsQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class StudentsRepository {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) {}

  create(data: Partial<Student>) {
    return this.repo.create(data);
  }

  save(student: Student) {
    return this.repo.save(student);
  }

  findAll() {
    return this.repo.find({
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }

  async findWithFilters(
    query: GetStudentsQueryDto,
  ): Promise<PaginatedResponseDto<Student>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .orderBy('student.id', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(student.fullName ILIKE :search OR student.registrationNumber ILIKE :search OR user.email ILIKE :search)',
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

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  findByRegistrationNumber(registrationNumber: string) {
    return this.repo.findOne({
      where: { registrationNumber },
      relations: ['user'],
    });
  }

  async deleteStudent(id: number) {
    const student = await this.findById(id);
    if (student) await this.repo.remove(student);
  }

  async softDeleteStudent(id: number) {
    const student = await this.findById(id);
    if (student) await this.repo.softRemove(student);
  }
}
