import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassroomResponseDto } from '../dto';
import { commonErrorResponses } from '../../../common';

export function CreateClassroomDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new classroom' }),
    ApiCreatedResponse({ type: ClassroomResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllClassroomsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all classrooms' }),
    ApiOkResponse({ type: [ClassroomResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetClassroomByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get classroom by ID' }),
    ApiOkResponse({ type: ClassroomResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateClassroomDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update classroom by ID' }),
    ApiOkResponse({ type: ClassroomResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteClassroomDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete classroom by ID' }),
    ApiOkResponse({ description: 'Classroom deleted successfully' }),
    ApiBearerAuth(),
  );
}
