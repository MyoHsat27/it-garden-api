import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  TeacherResponseDto,
  CreateTeacherDto,
  UpdateTeacherDto,
  GetTeachersQueryDto,
} from './dto';
import { TeachersRepository } from './teachers.repository';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums';
import { CryptoHelper, PaginatedResponseDto } from '../../common';

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
        gender: dto.gender,
        user,
      }),
    );

    return plainToInstance(TeacherResponseDto, teacher);
  }

  async findAll() {
    return this.teachersRepository.findAll();
  }

  async findAllTeachersWithFilters(query: GetTeachersQueryDto) {
    const result = await this.teachersRepository.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(TeacherResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async findOne(id: number): Promise<TeacherResponseDto> {
    const teacher = await this.teachersRepository.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return plainToInstance(TeacherResponseDto, teacher);
  }

  async update(id: number, dto: UpdateTeacherDto): Promise<TeacherResponseDto> {
    const teacher = await this.teachersRepository.findById(id);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const userToUpdate = teacher.user;

    if (dto.fullName && teacher.fullName !== dto.fullName) {
      const uniqueUsername = await this.usersService.generateUniqueUsername(
        dto.fullName,
      );
      userToUpdate.username = uniqueUsername;
      teacher.fullName = dto.fullName;
    }

    if (dto.email && userToUpdate.email !== dto.email) {
      const existingUserWithNewEmail = await this.usersService.findByEmail(
        dto.email,
      );
      if (
        existingUserWithNewEmail &&
        existingUserWithNewEmail.id !== userToUpdate.id
      ) {
        throw new BadRequestException('Email already in use');
      }
      userToUpdate.email = dto.email;
    }

    if (dto.password) {
      const hashedPassword = await CryptoHelper.hashPassword(dto.password);
      userToUpdate.password = hashedPassword;
    }

    teacher.phone = dto.phone ?? teacher.phone;
    teacher.address = dto.address ?? teacher.address;
    teacher.gender = dto.gender ?? teacher.gender;

    const updatedTeacher = await this.teachersRepository.save(teacher);
    return plainToInstance(TeacherResponseDto, updatedTeacher);
  }

  async remove(id: number): Promise<void> {
    const teacher = await this.teachersRepository.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    await this.teachersRepository.softDeleteTeacher(teacher.id);
  }
}
