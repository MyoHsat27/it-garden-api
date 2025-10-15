import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { UsersModule } from '../users/users.module';
import { StudentsRepository } from './students.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), UsersModule],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository],
  exports: [StudentsService, StudentsRepository],
})
export class StudentsModule {}
