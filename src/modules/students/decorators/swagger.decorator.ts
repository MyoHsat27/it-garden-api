import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { commonErrorResponses } from '../../../common';
import { StudentResponseDto } from '../dto';

export function CreateStudentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new teacher' }),
    ApiCreatedResponse({ type: StudentResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllStudentsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all students' }),
    ApiOkResponse({ type: [StudentResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetStudentByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get student by ID' }),
    ApiOkResponse({ type: StudentResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateStudentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update student by ID' }),
    ApiOkResponse({ type: StudentResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteStudentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete student by ID' }),
    ApiOkResponse({ description: 'Student deleted successfully' }),
    ApiBearerAuth(),
  );
}
