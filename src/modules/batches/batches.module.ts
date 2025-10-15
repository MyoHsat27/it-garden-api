import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { Batch } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/entities';
import { Teacher } from '../teachers/entities';
import { BatchesRepository } from './batches.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Course, Teacher])],
  controllers: [BatchesController],
  providers: [BatchesService, BatchesRepository],
  exports: [BatchesService, BatchesRepository],
})
export class BatchesModule {}
