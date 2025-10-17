import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { PaymentMethod } from '../../../common';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  enrollmentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  paidAt: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
