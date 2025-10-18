import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from './entities/attendance-record.entity';

@Injectable()
export class AttendanceRecordsRepository {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly repo: Repository<AttendanceRecord>,
  ) {}

  create(record: Partial<AttendanceRecord>) {
    return this.repo.save(record);
  }

  async bulkCreate(records: Partial<AttendanceRecord>[]) {
    const entities = this.repo.create(records);
    return this.repo.save(entities);
  }

  findAll(): Promise<AttendanceRecord[]> {
    return this.repo.find({ relations: ['enrollment', 'timetable'] });
  }

  async findForTimetableAndDate(timetableId: number, date: string) {
    return this.repo.find({
      where: { timetable: { id: timetableId }, date: new Date(date) },
      relations: ['enrollment', 'enrollment.student', 'timetable'],
      order: { id: 'ASC' },
    });
  }

  async findByEnrollmentAndDate(enrollmentId: number, date: string) {
    return this.repo.findOne({
      where: { enrollment: { id: enrollmentId }, date: new Date(date) },
    });
  }

  async findById(id: number): Promise<AttendanceRecord | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['enrollment', 'timetable'],
    });
  }

  update(record: AttendanceRecord) {
    return this.repo.save(record);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`AttendanceRecord ${id} not found`);
  }
}
