import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TeacherResponseDto, CreateTeacherDto, UpdateTeacherDto } from './dto';
import { TeachersRepository } from './teachers.repository';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums';

@Injectable()
export class TeachersService {
  constructor(
    private readonly teachersRepository: TeachersRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateTeacherDto): Promise<TeacherResponseDto> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const uniqueUsername = await this.usersService.generateUniqueUsername(
      dto.fullName,
    );

    const user = await this.usersService.create({
      username: uniqueUsername,
      email: dto.email,
      password: dto.password,
      userRole: UserRole.TEACHER,
    });

    const teacher = await this.teachersRepository.save(
      this.teachersRepository.create({
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        user,
      }),
    );

    return plainToInstance(TeacherResponseDto, teacher);
  }

  async findAll(): Promise<TeacherResponseDto[]> {
    const teachers = await this.teachersRepository.findAll();
    return plainToInstance(TeacherResponseDto, teachers);
  }

  async findOne(id: number): Promise<TeacherResponseDto> {
    const teacher = await this.teachersRepository.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return plainToInstance(TeacherResponseDto, teacher);
  }

  async update(id: number, dto: UpdateTeacherDto): Promise<TeacherResponseDto> {
    const teacher = await this.teachersRepository.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');

    Object.assign(teacher, dto);
    const updated = await this.teachersRepository.save(teacher);
    return plainToInstance(TeacherResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const teacher = await this.teachersRepository.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    await this.teachersRepository.deleteTeacher(id);
  }
}
