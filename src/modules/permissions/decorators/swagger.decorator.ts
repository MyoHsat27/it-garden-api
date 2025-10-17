import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { commonErrorResponses } from '../../../common';
import { PermissionResponseDto } from '../dto';

export function GetAllPermissionsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all permissions' }),
    ApiOkResponse({ type: [PermissionResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetPermissionByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get permission by ID' }),
    ApiOkResponse({ type: PermissionResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}
