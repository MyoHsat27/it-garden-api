import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-records.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Controller('attendance-records')
export class AttendanceRecordsController {
  constructor(
    private readonly attendanceRecordsService: AttendanceRecordsService,
  ) {}

  @Post()
  create(@Body() createAttendanceRecordDto: CreateAttendanceRecordDto) {
    return this.attendanceRecordsService.create(createAttendanceRecordDto);
  }

  @Get()
  findAll() {
    return this.attendanceRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceRecordDto: UpdateAttendanceRecordDto,
  ) {
    return this.attendanceRecordsService.update(+id, updateAttendanceRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceRecordsService.remove(+id);
  }
}
