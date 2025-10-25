import { Injectable, Logger } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { plainToInstance } from 'class-transformer';
import { AnnouncementResponseDto } from '../announcements/dto';
import { AssignmentResponseDto } from '../assignments/dto';
import { SubmissionResponseDto } from '../submissions/dto';

@Injectable()
export class DashboardService {
  constructor(private readonly repo: DashboardRepository) {}

  async getAdminDashboard() {
    const totalStudents = await this.repo.countStudents();
    const totalTeachers = await this.repo.countTeachers();
    const totalAdmins = await this.repo.countAdmins();
    const monthlyRevenue = await this.repo.getMonthlyRevenue();

    const dailyEnrollments = await this.repo.getEnrollmentByDay();
    const yearlyEnrollments = await this.repo.getEnrollmentByMonth();

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalAdmins,
        monthlyRevenue,
      },
      charts: {
        dailyEnrollments,
        yearlyEnrollments,
      },
    };
  }

  async getTeacherDashboard(teacherId: number) {
    const stats = await this.repo.getTeacherStats(teacherId);
    const recentSubmissions = await this.repo.getRecentSubmissions(teacherId);

    return {
      stats,
      recentSubmissions: plainToInstance(
        SubmissionResponseDto,
        recentSubmissions,
      ),
    };
  }

  async getStudentDashboard(studentId: number) {
    const stats = await this.repo.getStudentStats(studentId);
    const announcements = await this.repo.getAnnouncements(studentId);
    const recentAssignments = await this.repo.getRecentAssignments(studentId);

    return {
      stats,
      announcements: plainToInstance(AnnouncementResponseDto, announcements),
      recentAssignments: plainToInstance(
        AssignmentResponseDto,
        recentAssignments,
      ),
    };
  }
}
