import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Timetable } from '../timetables/entities';
import { Exam } from '../exams/entities';
import { Assignment } from '../assignments/entities';
import { Enrollment } from '../enrollments/entities';
import { CalendarEvent, EventType } from './entities/calendar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateTimetableOccurrences } from './utils';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepo: Repository<Timetable>,
    @InjectRepository(Exam)
    private readonly examRepo: Repository<Exam>,
    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async getAdminCalendar(): Promise<CalendarEvent[]> {
    const timetables = await this.timetableRepo.find({
      relations: ['batch', 'batch.course', 'teacher', 'classroom', 'timeSlot'],
    });
    const exams = await this.examRepo.find({
      relations: ['batch', 'batch.course', 'classroom'],
    });
    const assignments = await this.assignmentRepo.find({
      relations: ['batch', 'batch.course'],
    });

    return [
      ...this.mapTimetables(timetables),
      ...this.mapExams(exams),
      ...this.mapAssignments(assignments),
    ];
  }

  async getTeacherCalendar(teacherId: number): Promise<CalendarEvent[]> {
    const timetables = await this.timetableRepo.find({
      where: { teacher: { id: teacherId } },
      relations: ['batch', 'batch.course', 'teacher', 'classroom', 'timeSlot'],
    });

    const exams = await this.examRepo.find({
      where: { batch: { teacher: { id: teacherId } } },
      relations: ['batch', 'batch.course', 'classroom'],
    });

    const assignments = await this.assignmentRepo.find({
      where: { batch: { teacher: { id: teacherId } } },
      relations: ['batch', 'batch.course'],
    });

    return [
      ...this.mapTimetables(timetables),
      ...this.mapExams(exams),
      ...this.mapAssignments(assignments),
    ];
  }

  async getStudentCalendar(studentId: number): Promise<CalendarEvent[]> {
    const enrollments = await this.enrollmentRepo.find({
      where: { student: { id: studentId } },
      relations: ['batch', 'batch.course'],
    });

    if (!enrollments.length) {
      throw new NotFoundException('No enrollments found for this student');
    }

    const batchIds = enrollments.map((e) => e.batch.id);

    const timetables = await this.timetableRepo.find({
      where: { batch: { id: In(batchIds) } },
      relations: ['batch', 'batch.course', 'teacher', 'classroom', 'timeSlot'],
    });

    const exams = await this.examRepo.find({
      where: { batch: { id: In(batchIds) } },
      relations: ['batch', 'batch.course', 'classroom'],
    });

    const assignments = await this.assignmentRepo.find({
      where: { batch: { id: In(batchIds) } },
      relations: ['batch', 'batch.course'],
    });

    return [
      ...this.mapTimetables(timetables),
      ...this.mapExams(exams),
      ...this.mapAssignments(assignments),
    ];
  }

  private mapTimetables(timetables: Timetable[]): CalendarEvent[] {
    return timetables.flatMap((tt) => {
      if (!tt.batch.startDate || !tt.batch.endDate) return [];
      const sessions = generateTimetableOccurrences(
        tt,
        tt.batch.startDate,
        tt.batch.endDate,
      );

      return sessions.map((sess, idx) => ({
        id: `class-${tt.id}-${idx}`,
        type: EventType.CLASS,
        title: tt.batch.course.name,
        start: sess.start,
        end: sess.end,
        courseName: tt.batch.course.name,
        batchName: tt.batch.name,
        teacherName: tt.teacher.fullName,
        classroom: tt.classroom.name,
      }));
    });
  }

  private mapExams(exams: Exam[]): CalendarEvent[] {
    return exams.map((exam) => ({
      id: `exam-${exam.id}`,
      type: EventType.EXAM,
      title: `${exam.title} (${exam.batch.name})`,
      start: new Date(`${exam.examDate}T${exam.startTime}`),
      end: new Date(`${exam.examDate}T${exam.endTime}`),
      batchName: exam.batch.name,
      courseName: exam.batch.course.name,
      classroom: exam.classroom.name,
    }));
  }

  private mapAssignments(assignments: Assignment[]): CalendarEvent[] {
    return assignments.flatMap((ass) => [
      {
        id: `ass-start-${ass.id}`,
        type: EventType.ASSIGNMENT,
        title: `Assignment Start - ${ass.title} (${ass.batch.name})`,
        start: ass.startDate,
        batchName: ass.batch.name,
        courseName: ass.batch.course.name,
      },
      {
        id: `ass-due-${ass.id}`,
        type: EventType.ASSIGNMENT,
        title: `Assignment Due - ${ass.title} (${ass.batch.name})`,
        start: ass.dueDate,
        batchName: ass.batch.name,
        courseName: ass.batch.course.name,
      },
    ]);
  }
}
