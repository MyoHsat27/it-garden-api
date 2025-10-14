import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticatedResponseDto } from '../dto/auth-response.dto';
import { LoginUserDto } from '../dto/login.dto';
import { ValidateOtpDto } from '../dto/validate-otp.dto';
import { commonErrorResponses } from '../../../common';

export function LoginUsersDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description:
        "This endpoint allows existing users to authenticate with the system. Users provide their email and password, and if they match what's in the database, a new JWT token is created for the user and returned in a cookie. If the email does not exist in the database, or if the password does not match, an error message is returned.",
    }),
    ApiBody({ type: LoginUserDto }),
    ApiOkResponse({
      description: 'Returns the user and access token',
      type: AuthenticatedResponseDto,
      headers: {
        'Set-Cookie': {
          description:
            'Contains the refresh token. HttpOnly, Secure, SameSite=Strict.',
          schema: {
            type: 'string',
            example:
              'refresh_token=your-long-refresh-token; Path=/; HttpOnly; Secure; SameSite=Strict',
          },
        },
      },
    }),
    ApiUnauthorizedResponse(commonErrorResponses.invalidCredentials),
    ApiNotFoundResponse(commonErrorResponses.notFound),
  );
}

export function LogoutUsersDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'User logout',
      description:
        'This endpoint deletes user fcm token for further notifications and refreshtokens when logged out, requires JWT',
    }),
    ApiOkResponse({
      description: 'Returns success message',
      type: String,
    }),
    ApiBearerAuth(),
  );
}

export function RefreshTokenDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send refresh token to receive new token and refreshToken',
    }),
    ApiCreatedResponse({
      description: 'Returns tokens',
      type: AuthenticatedResponseDto,
      headers: {
        'Set-Cookie': {
          description:
            'Contains the refresh token. HttpOnly, Secure, SameSite=Strict.',
          schema: {
            type: 'string',
            example:
              'refresh_token=your-long-refresh-token; Path=/; HttpOnly; Secure; SameSite=Strict',
          },
        },
      },
    }),
    ApiUnauthorizedResponse(commonErrorResponses.invalidKey),
    ApiBearerAuth(),
  );
}

export function VerifyEmailSetupDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send OTP for Email Verification',
      description:
        "Sends an OTP to the user's registered email for verification purposes.",
    }),
    ApiOkResponse({
      description: 'OTP sent successfully to the registered email address.',
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiBearerAuth(),
  );
}

export function ConfirmEmailSetupDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm Email Verification',
      description:
        "Confirms the email verification by validating the OTP sent to the user's email.",
    }),
    ApiBody({ type: ValidateOtpDto }),
    ApiOkResponse({
      description: 'Email verification confirmed successfully.',
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiBearerAuth(),
  );
}
