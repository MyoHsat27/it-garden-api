import { CreateBatchDto } from './../dto/create-batch.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { BatchResponseDto, UpdateBatchDto } from '../dto';
import { commonErrorResponses } from '../../../common';

export function CreateBatchDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new batch' }),
    ApiBody({ type: CreateBatchDto }),
    ApiCreatedResponse({ type: BatchResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllBatchesDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all batches' }),
    ApiOkResponse({ type: [BatchResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetBatchByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get batch by ID' }),
    ApiOkResponse({ type: BatchResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateBatchDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update batch by ID' }),
    ApiBody({ type: UpdateBatchDto }),
    ApiOkResponse({ type: BatchResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteBatchDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete batch by ID' }),
    ApiOkResponse({ description: 'Batch deleted successfully' }),
    ApiBearerAuth(),
  );
}
