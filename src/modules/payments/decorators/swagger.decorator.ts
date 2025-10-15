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
import { CreatePaymentDto, PaymentResponseDto, UpdatePaymentDto } from '../dto';

export function CreatePaymentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new payment' }),
    ApiBody({ type: CreatePaymentDto }),
    ApiCreatedResponse({ type: PaymentResponseDto }),
    ApiBearerAuth(),
  );
}

export function GetAllPaymentsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all payments' }),
    ApiOkResponse({ type: [PaymentResponseDto] }),
    ApiBearerAuth(),
  );
}

export function GetPaymentByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get payment by ID' }),
    ApiOkResponse({ type: PaymentResponseDto }),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiBearerAuth(),
  );
}

export function UpdatePaymentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update payment by ID' }),
    ApiBody({ type: UpdatePaymentDto }),
    ApiOkResponse({ type: PaymentResponseDto }),
    ApiBearerAuth(),
  );
}

export function DeletePaymentDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete payment by ID' }),
    ApiOkResponse({ description: 'Payment deleted successfully' }),
    ApiBearerAuth(),
  );
}
