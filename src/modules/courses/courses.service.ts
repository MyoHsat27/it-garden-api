import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CoursesRepository } from './courses.repository';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseResponseDto,
  GetCoursesQueryDto,
} from './dto';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepository: CoursesRepository) {}

  async create(dto: CreateCourseDto): Promise<CourseResponseDto> {
    const existingCourse = await this.courseRepository.findExisting(dto.name);

    if (existingCourse)
      throw new BadRequestException(`Course ${dto.name} already exists`);

    const course = await this.courseRepository.create(dto);
    return plainToInstance(CourseResponseDto, course);
  }

  async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepository.findAll();
    return plainToInstance(CourseResponseDto, courses);
  }

  async findOne(id: number): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    return plainToInstance(CourseResponseDto, course);
  }

  async findAllCoursesWithFilters(query: GetCoursesQueryDto) {
    const result = await this.courseRepository.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(CourseResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async update(id: number, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);

    if (dto.name) {
      const existingCourse = await this.courseRepository.findExisting(
        dto.name,
        course.id,
      );

      if (existingCourse)
        throw new BadRequestException(`Course ${dto.name} already exists`);
    }

    Object.assign(course, dto);
    const updated = await this.courseRepository.update(course);
    return plainToInstance(CourseResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException(`Course not found`);
    if (course.batches.length > 0)
      throw new BadRequestException(
        `Cannot delete the course that has existing batches`,
      );

    const affected = await this.courseRepository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Course not found`);
    }
  }
}
