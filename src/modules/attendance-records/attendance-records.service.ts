import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AttendanceRecordsRepository } from './attendance-records.repository';
import { EnrollmentsRepository } from '../enrollments/enrollments.repository';
import { TimetablesRepository } from '../timetables/timetables.repository';
import {
  UpdateAttendanceRecordDto,
  AttendanceRecordResponseDto,
  TimetableSessionDto,
  CreateAttendanceSessionDto,
  GetTimetableSessionQueryDto,
} from './dto';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceRecordStatus } from './enums/attendance-record-status.enum';
import { generateTimetableOccurrences } from '../calendars/utils';
import { format, parseISO } from 'date-fns';
import { PaginatedResponseDto } from '../../common';
import { TimetableSessionStatus } from './enums/timetable-session-status.enum';

@Injectable()
export class AttendanceRecordsService {
  constructor(
    private readonly repository: AttendanceRecordsRepository,
    private readonly enrollmentsRepo: EnrollmentsRepository,
    private readonly timetablesRepo: TimetablesRepository,
  ) {}

  async getTeacherTimetableSessions(
    teacherId: number,
    query: GetTimetableSessionQueryDto,
  ): Promise<PaginatedResponseDto<TimetableSessionDto>> {
    const timetables = await this.timetablesRepo.findByTeacherId(teacherId);

    const sessions: TimetableSessionDto[] = [];

    for (const tt of timetables) {
      const batchStart = tt.batch.startDate;
      const batchEnd = tt.batch.endDate;
      if (!batchStart || !batchEnd) continue;

      const occurrences = generateTimetableOccurrences(
        tt,
        batchStart,
        batchEnd,
      );

      for (const occ of occurrences) {
        const dateStr = format(occ.start, 'yyyy-MM-dd');

        const records = await this.repository.findForTimetableAndDate(
          tt.id,
          dateStr,
        );
        const total = records.length;
        const present = records.filter((r) => r.present).length;

        sessions.push({
          id: `${tt.id}-${dateStr}`,
          timetableId: tt.id,
          batchId: tt.batch.id,
          batchName: tt.batch.name,
          courseName: tt.batch.course?.name ?? '',
          teacherName: tt.teacher?.fullName ?? '',
          classroomName: tt.classroom?.name ?? '',
          date: dateStr,
          startTime: occ.start.toTimeString().slice(0, 8),
          endTime: occ.end.toTimeString().slice(0, 8),
          status:
            total > 0
              ? TimetableSessionStatus.FINISHED
              : TimetableSessionStatus.PENDING,
          attendanceSummary: total > 0 ? `${present}/${total}` : undefined,
        });
      }
    }

    sessions.sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
    );

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const totalItems = sessions.length;
    const startIndex = (page - 1) * limit;
    const paginated = sessions.slice(startIndex, startIndex + limit);

    return new PaginatedResponseDto<TimetableSessionDto>(
      paginated,
      totalItems,
      page,
      limit,
    );
  }

  async generateAttendanceRecords(
    sessionId: string,
  ): Promise<AttendanceRecordResponseDto[]> {
    const [timetableId, ...datePiece] = sessionId.split('-');
    const date = datePiece.join('-');
    const timetable = await this.timetablesRepo.findById(Number(timetableId));

    if (!timetable) throw new NotFoundException('Timetable not found');
    if (
      !timetable.batch ||
      !timetable.batch.startDate ||
      !timetable.batch.endDate
    ) {
      throw new BadRequestException(
        'Batch start/end date not set for timetable',
      );
    }

    const d = parseISO(date);
    if (
      d < new Date(timetable.batch.startDate) ||
      d > new Date(timetable.batch.endDate)
    ) {
      throw new BadRequestException('Date is outside batch date range');
    }

    if (d.getDay() !== timetable.dayOfWeek) {
      throw new BadRequestException(
        'Selected date is not a session day for this timetable',
      );
    }

    const enrollments = await this.enrollmentsRepo.findByBatchId(
      timetable.batch.id,
    );
    if (!enrollments.length)
      throw new NotFoundException('No enrollments for this batch');

    const created: AttendanceRecord[] = [];

    for (const en of enrollments) {
      const existing = await this.repository.findByEnrollmentAndDate(
        en.id,
        date,
      );
      if (existing) {
        created.push(existing);
        continue;
      }
      const rec: Partial<AttendanceRecord> = {
        enrollment: en,
        timetable,
        date: new Date(date),
        present: false,
        status: AttendanceRecordStatus.SCHEDULED,
      };
      const saved = await this.repository.create(rec);
      created.push(saved);
    }

    return created.map((r) =>
      plainToInstance(AttendanceRecordResponseDto, {
        id: r.id,
        enrollmentId: r.enrollment.id,
        studentId: r.enrollment.student.id,
        studentName: r.enrollment.student.fullName,
        timetableId: r.timetable?.id,
        date: (r.date as Date).toISOString().slice(0, 10),
        present: r.present,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }),
    );
  }

  async getRecordsForSession(
    sessionId: string,
  ): Promise<AttendanceRecordResponseDto[]> {
    const [timetableId, ...datePiece] = sessionId.split('-');
    const date = datePiece.join('-');

    const records = await this.repository.findForTimetableAndDate(
      Number(timetableId),
      date,
    );
    return records.map((r) =>
      plainToInstance(AttendanceRecordResponseDto, {
        id: r.id,
        enrollmentId: r.enrollment.id,
        studentId: r.enrollment.student.id,
        studentName: r.enrollment.student.fullName,
        timetableId: r.timetable?.id,
        date: new Date(r.date).toISOString().slice(0, 10),
        present: r.present,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }),
    );
  }

  async updateRecord(
    dto: UpdateAttendanceRecordDto,
  ): Promise<AttendanceRecordResponseDto> {
    const record = await this.repository.findById(dto.id);
    if (!record)
      throw new NotFoundException(`Attendance record ${dto.id} not found`);
    record.present = dto.present;
    const updated = await this.repository.update(record);
    return plainToInstance(AttendanceRecordResponseDto, updated);
  }
}
