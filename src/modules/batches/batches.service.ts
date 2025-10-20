import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BatchesRepository } from './batches.repository';
import { BatchResponseDto, CreateBatchDto, UpdateBatchDto } from './dto';
import { Batch } from './entities/batch.entity';
import { GetBatchesQueryDto } from './dto/get-batches-query.dto';
import { plainToInstance } from 'class-transformer';
import { dayOfWeek, formatTimeAMPM, PaginatedResponseDto } from '../../common';
import { TeachersRepository } from '../teachers/teachers.repository';
import { ClassroomsRepository } from '../classrooms/classrooms.repository';
import { TimeSlotsRepository } from '../time-slots/time-slots.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { Timetable } from '../timetables/entities';
import { User } from '../users/entities';
import { UserRole } from '../users/enums';

@Injectable()
export class BatchesService {
  constructor(
    private readonly repo: BatchesRepository,
    private readonly teacherRepo: TeachersRepository,
    private readonly classroomRepo: ClassroomsRepository,
    private readonly courseRepo: CoursesRepository,
    private readonly timeSlotRepo: TimeSlotsRepository,
  ) {}

  async create(dto: CreateBatchDto): Promise<Batch> {
    const existingBatch = await this.repo.findByName(dto.name);
    if (existingBatch)
      throw new BadRequestException(`Batch ${dto.name} already exists`);

    const course = await this.courseRepo.findById(dto.courseId);
    if (!course)
      throw new NotFoundException(`Course with id ${dto.courseId} not found`);

    const teacher = await this.teacherRepo.findById(dto.teacherId);
    if (!teacher)
      throw new NotFoundException(`Teacher with id ${dto.teacherId} not found`);

    const classroom = await this.classroomRepo.findById(dto.classroomId);
    if (!classroom)
      throw new NotFoundException(
        `Classroom with id ${dto.classroomId} not found`,
      );

    for (const entry of dto.timetables) {
      const timeSlot = await this.timeSlotRepo.findById(entry.timeSlotId);
      if (!timeSlot) {
        throw new NotFoundException(
          `TimeSlot with id ${entry.timeSlotId} not found`,
        );
      }

      const teacherConflict = await this.teacherRepo.checkTeacherConflict(
        dto.teacherId,
        entry.dayOfWeek,
        entry.timeSlotId,
        new Date(dto.startDate),
        new Date(dto.endDate),
      );
      if (teacherConflict) {
        throw new BadRequestException(
          `Teacher (${teacher.fullName}) already has a class (${teacherConflict.batch.name}) from ${new Date(teacherConflict.batch.startDate).toLocaleDateString()} to ${new Date(teacherConflict.batch.endDate).toLocaleDateString()} on ${dayOfWeek[entry.dayOfWeek].label ?? `day ${entry.dayOfWeek}`} [${formatTimeAMPM(timeSlot.startTime)} - ${formatTimeAMPM(timeSlot.endTime)}]`,
        );
      }

      const classroomConflict = await this.classroomRepo.checkClassroomConflict(
        dto.classroomId,
        entry.dayOfWeek,
        entry.timeSlotId,
        new Date(dto.startDate),
        new Date(dto.endDate),
      );
      if (classroomConflict) {
        throw new BadRequestException(
          `Classroom (${classroom.name}) already booked by batch (${classroomConflict.batch.name}) from ${new Date(classroomConflict.batch.startDate).toLocaleDateString()} to ${new Date(classroomConflict.batch.endDate).toLocaleDateString()} on ${dayOfWeek[entry.dayOfWeek].label ?? `day ${entry.dayOfWeek}`} [${formatTimeAMPM(timeSlot.startTime)} - ${formatTimeAMPM(timeSlot.endTime)}]`,
        );
      }
    }

    return this.repo.create({
      name: dto.name,
      description: dto.description,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      course,
      teacher,
      classroom,
      timetables: dto.timetables.map(
        (t) =>
          ({
            dayOfWeek: t.dayOfWeek,
            timeSlot: { id: t.timeSlotId },
            classroom,
            teacher,
          }) as Timetable,
      ),
    });
  }

  async findAll(user: User): Promise<Batch[]> {
    let batches: Batch[] = [];
    if (user.userRole === UserRole.TEACHER && user.teacherProfile) {
      batches = await this.repo.findByTeacherId(user.teacherProfile.id);
    } else {
      batches = await this.repo.findAll();
    }
    const batchesWithSpots = batches.map((batch) => ({
      ...batch,
      spotsLeft: batch.classroom.capacity - batch.enrollments.length,
    }));
    return batchesWithSpots;
  }

  async findAllBatchesWithFilters(query: GetBatchesQueryDto) {
    const result = await this.repo.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(BatchResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async findOne(id: number): Promise<Batch> {
    const batch = await this.repo.findById(id);
    if (!batch) {
      throw new NotFoundException(`Batch with id ${id} not found`);
    }
    return batch;
  }

  async update(id: number, dto: UpdateBatchDto): Promise<Batch> {
    const batch = await this.repo.findById(id);
    if (!batch) throw new NotFoundException(`Batch with id ${id} not found`);

    if (dto.name) {
      const existingBatch = await this.repo.findExisting(dto.name, batch.id);

      if (existingBatch)
        throw new BadRequestException(`Batch ${dto.name} already exists`);
    }

    if (dto.courseId) {
      const course = await this.courseRepo.findById(dto.courseId);
      if (!course)
        throw new NotFoundException(`Course with id ${dto.courseId} not found`);
      batch.course = course;
    }

    if (dto.teacherId) {
      const teacher = await this.teacherRepo.findById(dto.teacherId);
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      batch.teacher = teacher;
    }

    if (dto.name !== undefined) batch.name = dto.name;
    if (dto.description !== undefined) batch.description = dto.description;

    return this.repo.create(batch);
  }

  async remove(id: number): Promise<void> {
    const batch = await this.repo.findById(id);
    if (!batch) throw new NotFoundException(`Batch not found`);
    if (batch.enrollments.length > 0)
      throw new BadRequestException(
        `Cannot delete the batch that has existing enrollments`,
      );

    const affected = await this.repo.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Batch with id ${id} not found`);
    }
  }
}
