import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('teacher') getTeacherDashboard(@Req() req: any) {
    const userId = req.user.teacherProfile.id;
    return this.dashboardService.getTeacherDashboard(userId);
  }

  @Get('student') getStudentDashboard(@Req() req: any) {
    const userId = req.user.studentProfile.id;
    return this.dashboardService.getStudentDashboard(userId);
  }
}
