import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../enums';
import { Expose } from 'class-transformer';
import { StudentResponseDto } from '../../students/dto';
import { BatchResponseDto } from '../../batches/dto';

export class EnrollmentResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ type: StudentResponseDto })
  @Expose()
  student: StudentResponseDto;

  @ApiProperty({ type: BatchResponseDto })
  @Expose()
  batch: BatchResponseDto;

  @ApiProperty()
  @Expose()
  feeAmount: number;

  @ApiProperty({ enum: PaymentStatus })
  @Expose()
  feeStatus: PaymentStatus;

  @ApiProperty()
  @Expose()
  dueDate: string;
}
