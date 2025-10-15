import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { commonErrorResponses } from '../../../common';
import { TeacherResponseDto } from '../dto';

export function CreateTeacherDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new teacher' }),
    ApiCreatedResponse({ type: TeacherResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllTeachersDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all teachers' }),
    ApiOkResponse({ type: [TeacherResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetTeacherByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get teacher by ID' }),
    ApiOkResponse({ type: TeacherResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateTeacherDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update teacher by ID' }),
    ApiOkResponse({ type: TeacherResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteTeacherDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete teacher by ID' }),
    ApiOkResponse({ description: 'Teacher deleted successfully' }),
    ApiBearerAuth(),
  );
}
