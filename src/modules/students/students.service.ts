import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StudentResponseDto, CreateStudentDto, UpdateStudentDto } from './dto';
import { StudentsRepository } from './students.repository';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateStudentDto): Promise<StudentResponseDto> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const uniqueUsername = await this.usersService.generateUniqueUsername(
      dto.fullName,
    );

    const user = await this.usersService.create({
      username: uniqueUsername,
      email: dto.email,
      password: dto.password,
      userRole: UserRole.STUDENT,
    });

    const student = await this.studentsRepository.save(
      this.studentsRepository.create({
        fullName: dto.fullName,
        registrationNumber: dto.registrationNumber,
        guardianName: dto.guardianName,
        guardianContact: dto.guardianContact,
        phone: dto.phone,
        address: dto.address,
        user,
      }),
    );

    return plainToInstance(StudentResponseDto, student);
  }

  async findAll(): Promise<StudentResponseDto[]> {
    const students = await this.studentsRepository.findAll();
    return plainToInstance(StudentResponseDto, students);
  }

  async findOne(id: number): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return plainToInstance(StudentResponseDto, student);
  }

  async update(id: number, dto: UpdateStudentDto): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findById(id);
    if (!student) throw new NotFoundException('Student not found');

    Object.assign(student, dto);
    const updated = await this.studentsRepository.save(student);
    return plainToInstance(StudentResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const student = await this.studentsRepository.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    await this.studentsRepository.deleteStudent(id);
  }
}
