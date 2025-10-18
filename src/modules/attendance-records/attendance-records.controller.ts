import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-records.service';
import {
  CreateAttendanceSessionDto,
  GetTimetableSessionQueryDto,
  TimetableSessionDto,
  UpdateAttendanceRecordDto,
} from './dto';
import { UpdateAttendanceRecordDecorator } from './decorators';
import { JwtAuthGuard } from '../auth/guards';
import { PaginatedResponseDto } from '../../common';

@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceRecordsController {
  constructor(private readonly service: AttendanceRecordsService) {}

  @Get('teachers/:teacherId/sessions')
  @HttpCode(HttpStatus.OK)
  async getTeacherSessions(
    @Param('teacherId') teacherId: number,
    @Query() query: GetTimetableSessionQueryDto,
  ): Promise<PaginatedResponseDto<TimetableSessionDto>> {
    return this.service.getTeacherTimetableSessions(Number(teacherId), query);
  }

  @Post('sessions/:sessionId/generate')
  @HttpCode(HttpStatus.CREATED)
  async generateRecords(@Param('sessionId') sessionId: string) {
    return this.service.generateAttendanceRecords(sessionId);
  }

  @Get('sessions/:sessionId/records')
  @HttpCode(HttpStatus.OK)
  async getRecords(@Param('sessionId') sessionId: string) {
    return this.service.getRecordsForSession(sessionId);
  }

  @Put('records')
  @UpdateAttendanceRecordDecorator()
  @HttpCode(HttpStatus.OK)
  update(@Body() dto: UpdateAttendanceRecordDto) {
    return this.service.updateRecord(dto);
  }
}
