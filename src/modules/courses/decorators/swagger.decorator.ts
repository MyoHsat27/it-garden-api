import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CourseResponseDto } from '../dto';
import { commonErrorResponses } from '../../../common';

export function CreateCourseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new course' }),
    ApiCreatedResponse({ type: CourseResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllCoursesDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all courses' }),
    ApiOkResponse({ type: [CourseResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetCourseByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get course by ID' }),
    ApiOkResponse({ type: CourseResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateCourseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update course by ID' }),
    ApiOkResponse({ type: CourseResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteCourseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete course by ID' }),
    ApiOkResponse({ description: 'Course deleted successfully' }),
    ApiBearerAuth(),
  );
}
