import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AttendanceRecordsRepository } from './attendance-records.repository';
import { EnrollmentsRepository } from '../enrollments/enrollments.repository';
import { TimetablesRepository } from '../timetables/timetables.repository';
import {
  CreateAttendanceRecordDto,
  UpdateAttendanceRecordDto,
  AttendanceRecordResponseDto,
} from './dto';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceRecordStatus } from './enums/attendance-record-status.enum';

@Injectable()
export class AttendanceRecordsService {
  constructor(
    private readonly repository: AttendanceRecordsRepository,
    private readonly enrollmentsRepo: EnrollmentsRepository,
    private readonly timetablesRepo: TimetablesRepository,
  ) {}

  async create(
    dto: CreateAttendanceRecordDto,
  ): Promise<AttendanceRecordResponseDto> {
    const enrollment = await this.enrollmentsRepo.findById(dto.enrollmentId);
    const timetable = await this.timetablesRepo.findById(dto.timetableId);

    if (!enrollment)
      throw new NotFoundException(`Enrollment ${dto.enrollmentId} not found`);
    if (!timetable)
      throw new NotFoundException(`Timetable ${dto.timetableId} not found`);

    const record = new AttendanceRecord();
    record.enrollment = enrollment;
    record.timetable = timetable;
    record.date = new Date(dto.date);
    record.present = dto.present;
    record.status = AttendanceRecordStatus.SCHEDULED;

    const saved = await this.repository.create(record);
    return plainToInstance(AttendanceRecordResponseDto, saved);
  }

  async findAll(): Promise<AttendanceRecordResponseDto[]> {
    const records = await this.repository.findAll();
    return plainToInstance(AttendanceRecordResponseDto, records);
  }

  async findOne(id: number): Promise<AttendanceRecordResponseDto> {
    const record = await this.repository.findById(id);
    return plainToInstance(AttendanceRecordResponseDto, record);
  }

  async update(
    id: number,
    dto: UpdateAttendanceRecordDto,
  ): Promise<AttendanceRecordResponseDto> {
    const record = await this.repository.findById(id);

    if (!record)
      throw new NotFoundException(`AttendanceRecord ${id} not found`);
    record.present = dto.present;
    const updated = await this.repository.update(record);
    return plainToInstance(AttendanceRecordResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
