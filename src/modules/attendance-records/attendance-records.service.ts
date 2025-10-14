import { Injectable } from '@nestjs/common';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Injectable()
export class AttendanceRecordsService {
  create(createAttendanceRecordDto: CreateAttendanceRecordDto) {
    return 'This action adds a new attendanceRecord';
  }

  findAll() {
    return `This action returns all attendanceRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceRecord`;
  }

  update(id: number, updateAttendanceRecordDto: UpdateAttendanceRecordDto) {
    return `This action updates a #${id} attendanceRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceRecord`;
  }
}
