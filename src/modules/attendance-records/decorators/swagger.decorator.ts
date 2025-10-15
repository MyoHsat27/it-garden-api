import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { commonErrorResponses } from '../../../common';
import {
  AttendanceRecordResponseDto,
  CreateAttendanceRecordDto,
  UpdateAttendanceRecordDto,
} from '../dto';

export function CreateAttendanceRecordDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new attendance record' }),
    ApiBody({ type: CreateAttendanceRecordDto }),
    ApiCreatedResponse({ type: AttendanceRecordResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllAttendanceRecordsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all attendance records' }),
    ApiOkResponse({ type: [AttendanceRecordResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetAttendanceRecordByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get attendance record by ID' }),
    ApiOkResponse({ type: AttendanceRecordResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateAttendanceRecordDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update attendance record by ID' }),
    ApiBody({ type: UpdateAttendanceRecordDto }),
    ApiOkResponse({ type: AttendanceRecordResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteAttendanceRecordDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete attendance record by ID' }),
    ApiOkResponse({ description: 'Attendance record deleted successfully' }),
    ApiBearerAuth(),
  );
}
