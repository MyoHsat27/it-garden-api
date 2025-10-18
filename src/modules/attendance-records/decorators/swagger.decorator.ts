import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AttendanceRecordResponseDto, UpdateAttendanceRecordDto } from '../dto';

export function UpdateAttendanceRecordDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update attendance record by ID' }),
    ApiBody({ type: UpdateAttendanceRecordDto }),
    ApiOkResponse({ type: AttendanceRecordResponseDto }),
    ApiBearerAuth(),
  );
}
