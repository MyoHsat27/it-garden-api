import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNumber, Min } from 'class-validator';
import { PaymentStatus } from '../enums';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  studentId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  batchId: number;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  feeStatus: PaymentStatus;

  @ApiProperty()
  @IsNumber()
  discountAmount: number;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  dueDate: string;
}
