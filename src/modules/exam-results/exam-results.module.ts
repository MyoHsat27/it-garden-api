import { Module } from '@nestjs/common';
import { ExamResultsService } from './exam-results.service';
import { ExamResultsController } from './exam-results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamResult } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ExamResult])],
  controllers: [ExamResultsController],
  providers: [ExamResultsService],
  exports: [ExamResultsService],
})
export class ExamResultsModule {}
