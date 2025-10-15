import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateEnrollmentDto,
  EnrollmentResponseDto,
  UpdateEnrollmentDto,
} from '../dto';
import { commonErrorResponses } from '../../../common';

export function CreateEnrollmentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Enroll a student in a batch' }),
    ApiBody({ type: CreateEnrollmentDto }),
    ApiCreatedResponse({ type: EnrollmentResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllEnrollmentsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all enrollments' }),
    ApiOkResponse({ type: [EnrollmentResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetEnrollmentByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get enrollment by ID' }),
    ApiOkResponse({ type: EnrollmentResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateEnrollmentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update enrollment' }),
    ApiBody({ type: UpdateEnrollmentDto }),
    ApiOkResponse({ type: EnrollmentResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteEnrollmentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete enrollment' }),
    ApiOkResponse({ description: 'Enrollment deleted successfully' }),
    ApiBearerAuth(),
  );
}
