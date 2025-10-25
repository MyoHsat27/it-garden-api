import { Injectable, Logger } from '@nestjs/common';
import { DataSource, IsNull, MoreThan } from 'typeorm';
import { Student } from '../students/entities';
import { Teacher } from '../teachers/entities';
import { Admin } from '../admins/entities';
import { Payment } from '../payments/entities';
import { User } from '../users/entities';
import { Batch } from '../batches/entities';
import { Assignment } from '../assignments/entities';
import { Submission } from '../submissions/entities';
import { SubmissionStatus } from '../submissions/enums';
import { Enrollment } from '../enrollments/entities';
import { Announcement } from '../announcements/entities';

@Injectable()
export class DashboardRepository {
  constructor(private readonly dataSource: DataSource) {}

  async countStudents(): Promise<number> {
    return this.dataSource.getRepository(Student).count();
  }

  async countTeachers(): Promise<number> {
    return this.dataSource.getRepository(Teacher).count();
  }

  async countAdmins(): Promise<number> {
    return this.dataSource.getRepository(Admin).count();
  }

  async getMonthlyRevenue(): Promise<number> {
    const qb = this.dataSource
      .getRepository(Payment)
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'sum')
      .where(
        'EXTRACT(MONTH FROM payment.createdAt) = EXTRACT(MONTH FROM CURRENT_DATE)',
      )
      .andWhere(
        'EXTRACT(YEAR FROM payment.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)',
      );

    //@ts-ignore
    const { sum } = await qb.getRawOne<{ sum: string }>();
    return Number(sum) || 0;
  }

  async getEnrollmentByDay() {
    const result = await this.dataSource.query(`
      SELECT 
        TO_CHAR(created_at, 'Dy') AS day,
        COUNT(*) AS count
      FROM enrollments
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY day
      ORDER BY MIN(created_at)
    `);
    return result.map((r) => ({ name: r.day, count: Number(r.count) }));
  }

  async getEnrollmentByMonth() {
    const result = await this.dataSource.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') AS month,
        COUNT(*) AS count
      FROM enrollments
      WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY month, EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `);
    return result.map((r) => ({ month: r.month, count: Number(r.count) }));
  }

  async countTeacherStudents(teacherId: number) {
    return this.dataSource
      .query(
        `
      SELECT COUNT(DISTINCT e.student_id) AS count
      FROM enrollment e
      JOIN class c ON c.id = e.class_id
      WHERE c.teacher_id = $1
    `,
        [teacherId],
      )
      .then((res) => Number(res[0].count));
  }

  async getTeacherStats(teacherId: number) {
    const totalStudents = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .innerJoin('student.enrollments', 'enrollment')
      .innerJoin('enrollment.batch', 'batch')
      .innerJoin('batch.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .getCount();

    const assignedClasses = await this.dataSource
      .getRepository(Batch)
      .count({ where: { teacher: { id: teacherId } }, relations: ['teacher'] });

    const pendingAssignments = await this.dataSource
      .getRepository(Submission)
      .count({
        where: {
          assignment: { batch: { teacher: { id: teacherId } } },
          status: SubmissionStatus.PENDING,
        },
        relations: [
          'assignment',
          'assignment.batch',
          'assignment.batch.teacher',
        ],
      });

    return {
      totalStudents,
      assignedClasses,
      pendingAssignments,
    };
  }

  async getRecentSubmissions(teacherId: number) {
    return this.dataSource.getRepository(Submission).find({
      where: { assignment: { batch: { teacher: { id: teacherId } } } },
      order: { submittedAt: 'DESC' },
      relations: ['assignment', 'assignment.batch', 'assignment.batch.teacher'],
      take: 5,
    });
  }

  async getStudentStats(studentId: number) {
    const enrolledCourses = await this.dataSource
      .getRepository(Enrollment)
      .createQueryBuilder('enrollments')
      .innerJoin('enrollments.student', 'student', 'student.id = :studentId', {
        studentId,
      })
      .getCount();

    const pendingAssignments = await this.dataSource
      .getRepository(Assignment)
      .createQueryBuilder('assignment')
      .innerJoin('assignment.batch', 'batch')
      .innerJoin('batch.enrollments', 'enrollment')
      .leftJoin(
        'assignment.submissions',
        'submission',
        'submission.enrollment.id = enrollment.id',
      )
      .where('enrollment.student.id = :studentId', { studentId })
      .andWhere('submission.id IS NULL')
      .getCount();

    return { enrolledCourses, pendingAssignments };
  }
  async getAnnouncements(studentId: number) {
    return this.dataSource
      .getRepository(Announcement)
      .createQueryBuilder('announcement')
      .leftJoin('announcement.batch', 'batch')
      .leftJoin('batch.enrollments', 'enrollment')
      .leftJoin('enrollment.student', 'student', 'student.id = :studentId', {
        studentId,
      })
      .where('batch.id IS NULL')
      .orWhere('student.id = :studentId')
      .orderBy('announcement.createdAt', 'DESC')
      .take(5)
      .getMany();
  }

  async getRecentAssignments(studentId: number) {
    return this.dataSource
      .getRepository(Assignment)
      .createQueryBuilder('assignment')
      .innerJoin('assignment.batch', 'batch')
      .innerJoin('batch.enrollments', 'enrollment')
      .innerJoin('enrollment.student', 'student', 'student.id = :studentId', {
        studentId,
      })
      .orderBy('assignment.dueDate', 'ASC')
      .take(5)
      .getMany();
  }
}
