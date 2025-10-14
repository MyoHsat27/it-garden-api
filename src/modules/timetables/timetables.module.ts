import { Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { TimetablesController } from './timetables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Timetable])],
  controllers: [TimetablesController],
  providers: [TimetablesService],
  exports: [TimetablesService],
})
export class TimetablesModule {}
