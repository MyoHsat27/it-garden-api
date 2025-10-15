import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities';
import { EnrollmentsRepository } from './enrollments.repository';
import { BatchesModule } from '../batches/batches.module';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]),
    BatchesModule,
    StudentsModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, EnrollmentsRepository],
  exports: [EnrollmentsService, EnrollmentsRepository],
})
export class EnrollmentsModule {}
