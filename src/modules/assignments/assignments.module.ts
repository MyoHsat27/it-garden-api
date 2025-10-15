import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities';
import { AssignmentsRepository } from './assignments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentsRepository],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
