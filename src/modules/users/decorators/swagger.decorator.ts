import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { commonErrorResponses } from '../../../common';

export function GetCurrentUserDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get current user',
      description:
        'This endpoint returns the details of the currently authenticated user. The user must be authenticated with a valid JWT token.',
    }),
    ApiOkResponse({
      description: 'Returns the current user',
      type: UserDto,
    }),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
  );
}

export function GetUserByIdDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user by ID',
      description:
        "This endpoint retrieves the user entry with the given ID from the database. Only administrators can access this endpoint to view other users' details. Details in this api are full user details so admin can access and edit all user details.",
    }),
    ApiOkResponse({
      description: 'Returns the user with the given ID',
      type: User,
    }),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
    ApiNotFoundResponse(commonErrorResponses.notFound),
  );
}

export function GetUserByEmailDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get users by email',
      description:
        'This endpoint retrieves a user from the database that match the given email. Only administrators can access this endpoint to search for users by their email. Details in this api are full user details so admin can access and edit all user details.',
    }),
    ApiQuery({ name: 'email', description: 'Email to search for users' }),
    ApiOkResponse({
      description: 'Returns users with the given email',
      type: User,
    }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
  );
}
