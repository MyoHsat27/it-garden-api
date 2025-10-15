import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities';

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
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async deleteStudent(id: number) {
    const student = await this.findById(id);
    if (student) await this.repo.remove(student);
  }
}
