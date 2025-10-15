import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto, UpdateCourseDto, CourseResponseDto } from './dto';

@Injectable()
export class CoursesService {
  constructor(private readonly repository: CoursesRepository) {}

  async create(dto: CreateCourseDto): Promise<CourseResponseDto> {
    const course = await this.repository.create(dto);
    return plainToInstance(CourseResponseDto, course);
  }

  async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.repository.findAll();
    return plainToInstance(CourseResponseDto, courses);
  }

  async findOne(id: number): Promise<CourseResponseDto> {
    const course = await this.repository.findById(id);
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    return plainToInstance(CourseResponseDto, course);
  }

  async update(id: number, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    const course = await this.repository.findById(id);
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);

    Object.assign(course, dto);
    const updated = await this.repository.update(course);
    return plainToInstance(CourseResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
  }
}
