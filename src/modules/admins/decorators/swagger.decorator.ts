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
import { AdminResponseDto, CreateAdminDto, UpdateAdminDto } from '../dto';

export function CreateAdminDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new admin' }),
    ApiCreatedResponse({ type: AdminResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllAdminsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all admins' }),
    ApiOkResponse({ type: [AdminResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetAdminByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get admin by ID' }),
    ApiOkResponse({ type: AdminResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateAdminDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update admin by ID' }),
    ApiBody({ type: UpdateAdminDto }),
    ApiOkResponse({ type: AdminResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteAdminDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete admin by ID' }),
    ApiOkResponse({ description: 'Admin deleted successfully' }),
    ApiBearerAuth(),
  );
}
