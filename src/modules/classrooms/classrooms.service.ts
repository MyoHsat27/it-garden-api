import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClassroomsRepository } from './classrooms.repository';
import {
  CreateClassroomDto,
  UpdateClassroomDto,
  ClassroomResponseDto,
} from './dto';

@Injectable()
export class ClassroomsService {
  constructor(private readonly repository: ClassroomsRepository) {}

  async create(dto: CreateClassroomDto): Promise<ClassroomResponseDto> {
    const classroom = await this.repository.create(dto);
    return plainToInstance(ClassroomResponseDto, classroom);
  }

  async findAll(): Promise<ClassroomResponseDto[]> {
    const classrooms = await this.repository.findAll();
    return plainToInstance(ClassroomResponseDto, classrooms);
  }

  async findOne(id: number): Promise<ClassroomResponseDto> {
    const classroom = await this.repository.findById(id);
    if (!classroom)
      throw new NotFoundException(`Classroom with id ${id} not found`);
    return plainToInstance(ClassroomResponseDto, classroom);
  }

  async update(
    id: number,
    dto: UpdateClassroomDto,
  ): Promise<ClassroomResponseDto> {
    const classroom = await this.repository.findById(id);
    if (!classroom)
      throw new NotFoundException(`Classroom with id ${id} not found`);

    Object.assign(classroom, dto);
    const updated = await this.repository.update(classroom);
    return plainToInstance(ClassroomResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Classroom with id ${id} not found`);
    }
  }
}
