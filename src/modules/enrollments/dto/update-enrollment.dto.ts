import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { EnrollmentStatus } from '../enums';
import { IsEnum } from 'class-validator';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @ApiProperty({ enum: EnrollmentStatus })
  @IsEnum(EnrollmentStatus)
  enrollmentStatus: EnrollmentStatus;
}
