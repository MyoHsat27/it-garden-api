import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '../enums';
import { Expose, Type } from 'class-transformer';
import { StudentResponseDto } from '../../students/dto';
import { BatchResponseDto } from '../../batches/dto';
import { PaymentStatus } from '../../../common';
import { PaymentResponseDto } from '../../payments/dto';

export class EnrollmentResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  feeAmount: number;

  @ApiProperty()
  @Expose()
  discountAmount: number;

  @ApiProperty()
  @Expose()
  finalFee: number;

  @ApiProperty({ enum: PaymentStatus })
  @Expose()
  feeStatus: PaymentStatus;

  @ApiProperty({ enum: EnrollmentStatus })
  @Expose()
  enrollmentStatus: EnrollmentStatus;

  @ApiProperty()
  @Expose()
  dueDate: string;

  @ApiProperty({ type: StudentResponseDto })
  @Expose()
  @Type(() => StudentResponseDto)
  student: StudentResponseDto;

  @ApiProperty({ type: BatchResponseDto })
  @Expose()
  @Type(() => BatchResponseDto)
  batch: BatchResponseDto;

  @ApiProperty({ type: () => PaymentResponseDto })
  @Expose()
  @Type(() => PaymentResponseDto)
  payment: PaymentResponseDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
