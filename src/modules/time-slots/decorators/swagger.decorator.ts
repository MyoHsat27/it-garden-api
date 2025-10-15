import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateTimeSlotDto,
  TimeSlotResponseDto,
  UpdateTimeSlotDto,
} from '../dto';
import { commonErrorResponses } from '../../../common';

export function CreateTimeSlotDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new timeslot' }),
    ApiBody({ type: CreateTimeSlotDto }),
    ApiCreatedResponse({ type: TimeSlotResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllTimeSlotsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all timeslots' }),
    ApiOkResponse({ type: [TimeSlotResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetTimeSlotByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get timeslot by ID' }),
    ApiOkResponse({ type: TimeSlotResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateTimeSlotDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update timeslot by ID' }),
    ApiBody({ type: UpdateTimeSlotDto }),
    ApiOkResponse({ type: TimeSlotResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteTimeSlotDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete timeslot by ID' }),
    ApiOkResponse({ description: 'Timeslot deleted successfully' }),
    ApiBearerAuth(),
  );
}
