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
import { RoleResponseDto, CreateRoleDto, UpdateRoleDto } from '../dto';

export function CreateRoleDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new role' }),
    ApiCreatedResponse({ type: CreateRoleDto }),
    ApiBearerAuth(),
  );
}

export function GetAllRolesDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all roles' }),
    ApiOkResponse({ type: [RoleResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetRoleByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get role by ID' }),
    ApiOkResponse({ type: RoleResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdateRoleDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update role by ID' }),
    ApiBody({ type: UpdateRoleDto }),
    ApiOkResponse({ type: RoleResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeleteRoleDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete role by ID' }),
    ApiOkResponse({ description: 'Role deleted successfully' }),
    ApiBearerAuth(),
  );
}
