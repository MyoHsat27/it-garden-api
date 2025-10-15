import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateTimetableDto,
  TimetableResponseDto,
  UpdateTimetableDto,
} from '../dto';
import { commonErrorResponses } from '../../../common';

export function CreateTimetableDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new timetable entry' }),
    ApiBody({ type: CreateTimetableDto }),
    ApiCreatedResponse({ type: TimetableResponseDto }),

    ApiBearerAuth(),
  );
}

export function GetAllTimetablesDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all timetable entries' }),
    ApiOkResponse({ type: [TimetableResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetTimetableByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get timetable by ID' }),
    ApiOkResponse({ type: TimetableResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateTimetableDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update timetable by ID' }),
    ApiBody({ type: UpdateTimetableDto }),
    ApiOkResponse({ type: TimetableResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteTimetableDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete timetable by ID' }),
    ApiOkResponse({ description: 'Timetable deleted successfully' }),
    ApiBearerAuth(),
  );
}
