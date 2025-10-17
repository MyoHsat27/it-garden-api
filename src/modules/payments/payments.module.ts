import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities';
import { PaymentsRepository } from './payments.repository';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
