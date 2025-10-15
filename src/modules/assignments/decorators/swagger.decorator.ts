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
  AssignmentResponseDto,
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from '../dto';

export function CreateAssignmentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new assignment' }),
    ApiBody({ type: CreateAssignmentDto }),
    ApiCreatedResponse({ type: AssignmentResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllAssignmentsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all assignments' }),
    ApiOkResponse({ type: [AssignmentResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetAssignmentByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get assignment by ID' }),
    ApiOkResponse({ type: AssignmentResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateAssignmentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update assignment by ID' }),
    ApiBody({ type: UpdateAssignmentDto }),
    ApiOkResponse({ type: AssignmentResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteAssignmentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete assignment by ID' }),
    ApiOkResponse({ description: 'Assignment deleted successfully' }),
    ApiBearerAuth(),
  );
}
