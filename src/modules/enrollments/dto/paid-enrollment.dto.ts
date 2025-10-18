import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

import { PaymentMethod, PaymentStatus } from '../../../common';

export class PaidEnrollmentDto {
  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  paidAt: string;
}
