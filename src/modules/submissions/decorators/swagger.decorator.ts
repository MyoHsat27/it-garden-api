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
  CreateSubmissionDto,
  SubmissionResponseDto,
  UpdateSubmissionDto,
} from '../dto';

export function CreateSubmissionDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new submission' }),
    ApiBody({ type: CreateSubmissionDto }),
    ApiCreatedResponse({ type: SubmissionResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllSubmissionsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all submissions' }),
    ApiOkResponse({ type: [SubmissionResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetSubmissionByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get submission by ID' }),
    ApiOkResponse({ type: SubmissionResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateSubmissionDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update submission by ID' }),
    ApiBody({ type: UpdateSubmissionDto }),
    ApiOkResponse({ type: SubmissionResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteSubmissionDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete submission by ID' }),
    ApiOkResponse({ description: 'submission deleted successfully' }),
    ApiBearerAuth(),
  );
}
