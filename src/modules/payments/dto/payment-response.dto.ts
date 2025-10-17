import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EnrollmentResponseDto } from '../../enrollments/dto';
import { PaymentMethod } from '../../../common';

export class PaymentResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ type: () => EnrollmentResponseDto })
  @Expose()
  enrollment: EnrollmentResponseDto;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  paidAt: Date;

  @ApiProperty()
  @Expose()
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
