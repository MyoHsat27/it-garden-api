import { Controller, Get, Param } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Get('admins')
  async getAdminCalendar(): Promise<CalendarResponseDto[]> {
    const events = await this.calendarsService.getAdminCalendar();
    return plainToInstance(CalendarResponseDto, events);
  }

  @Get('teachers/:id')
  async getTeacherCalendar(
    @Param('id') id: number,
  ): Promise<CalendarResponseDto[]> {
    const events = await this.calendarsService.getTeacherCalendar(+id);
    return plainToInstance(CalendarResponseDto, events);
  }

  @Get('students/:id')
  async getStudentCalendar(
    @Param('id') id: number,
  ): Promise<CalendarResponseDto[]> {
    const events = await this.calendarsService.getStudentCalendar(+id);
    return plainToInstance(CalendarResponseDto, events);
  }
}
