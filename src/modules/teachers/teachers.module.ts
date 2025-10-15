import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities';
import { UsersModule } from '../users/users.module';
import { TeachersRepository } from './teachers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), UsersModule],
  controllers: [TeachersController],
  providers: [TeachersService, TeachersRepository],
  exports: [TeachersService, TeachersRepository],
})
export class TeachersModule {}
