import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TimetablesRepository } from './timetables.repository';
import {
  CreateTimetableDto,
  UpdateTimetableDto,
  TimetableResponseDto,
} from './dto';
import { BatchesRepository } from '../batches/batches.repository';
import { TeachersRepository } from '../teachers/teachers.repository';
import { ClassroomsRepository } from '../classrooms/classrooms.repository';
import { TimeSlotsRepository } from '../time-slots/time-slots.repository';
import { Timetable } from './entities';

@Injectable()
export class TimetablesService {
  constructor(
    private readonly repository: TimetablesRepository,
    private readonly batchRepo: BatchesRepository,
    private readonly teacherRepo: TeachersRepository,
    private readonly classroomRepo: ClassroomsRepository,
    private readonly timeSlotRepo: TimeSlotsRepository,
  ) {}

  async create(dto: CreateTimetableDto): Promise<TimetableResponseDto> {
    const batch = await this.batchRepo.findById(dto.batchId);
    if (!batch) throw new NotFoundException('Batch not found');

    const teacher = await this.teacherRepo.findById(dto.teacherId);
    if (!teacher) throw new NotFoundException('Teacher not found');

    const classroom = await this.classroomRepo.findById(dto.classroomId);
    if (!classroom) throw new NotFoundException('Classroom not found');

    const timeSlot = await this.timeSlotRepo.findById(dto.timeSlotId);
    if (!timeSlot) throw new NotFoundException('TimeSlot not found');

    const conflict = await this.repository.findConflict(
      batch.id,
      teacher.id,
      classroom.id,
      timeSlot.id,
    );
    if (conflict)
      throw new BadRequestException(
        'Conflict detected for batch, teacher, or classroom',
      );

    const timetable = await this.repository.save({
      batch,
      teacher,
      classroom,
      timeSlot,
    } as Timetable);
    return plainToInstance(TimetableResponseDto, timetable);
  }

  async update(
    id: number,
    dto: UpdateTimetableDto,
  ): Promise<TimetableResponseDto> {
    const timetable = await this.repository.findById(id);
    if (!timetable) throw new NotFoundException('Timetable not found');

    if (dto.batchId)
      timetable.batch =
        (await this.batchRepo.findById(dto.batchId)) ?? timetable.batch;
    if (dto.teacherId)
      timetable.teacher =
        (await this.teacherRepo.findById(dto.teacherId)) ?? timetable.teacher;
    if (dto.classroomId)
      timetable.classroom =
        (await this.classroomRepo.findById(dto.classroomId)) ??
        timetable.classroom;
    if (dto.timeSlotId)
      timetable.timeSlot =
        (await this.timeSlotRepo.findById(dto.timeSlotId)) ??
        timetable.timeSlot;

    const conflict = await this.repository.findConflict(
      timetable.batch.id,
      timetable.teacher.id,
      timetable.classroom.id,
      timetable.timeSlot.id,
    );
    if (conflict && conflict.id !== id)
      throw new BadRequestException(
        'Conflict detected for batch, teacher, or classroom',
      );

    const updated = await this.repository.save(timetable);
    return plainToInstance(TimetableResponseDto, updated);
  }

  async findAll(): Promise<TimetableResponseDto[]> {
    const timetables = await this.repository.findAll();
    return plainToInstance(TimetableResponseDto, timetables);
  }

  async findOne(id: number): Promise<TimetableResponseDto> {
    const timetable = await this.repository.findById(id);
    if (!timetable) throw new NotFoundException('Timetable not found');
    return plainToInstance(TimetableResponseDto, timetable);
  }

  async remove(id: number): Promise<void> {
    const timetable = await this.repository.findById(id);
    if (!timetable) throw new NotFoundException('Timetable not found');
    await this.repository.delete(id);
  }
}
