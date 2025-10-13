import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private repo: Repository<Student>) {}

  async create(
    data: { fullName: string; user: User },
    entityManager?: EntityManager,
  ): Promise<Student> {
    const newLearner = this.repo.create(data);

    const manager = entityManager || this.repo.manager;

    return manager.save(newLearner);
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.repo.findOne({
      where: { user: { email: email.toLowerCase() } },
      relations: ['user'],
    });
  }
}
