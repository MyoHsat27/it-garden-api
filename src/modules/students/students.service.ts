import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  StudentResponseDto,
  CreateStudentDto,
  UpdateStudentDto,
  GetStudentsQueryDto,
} from './dto';
import { StudentsRepository } from './students.repository';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums';
import { CryptoHelper, PaginatedResponseDto } from '../../common';
import { REGISTRATION_NO_FORMAT } from './constants/student';

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
        registrationNumber: '',
        guardianName: dto.guardianName,
        guardianContact: dto.guardianContact,
        phone: dto.phone,
        address: dto.address,
        gender: dto.gender,
        user,
      }),
    );

    const paddedId = String(student.id).padStart(6, '0');
    student.registrationNumber = `${REGISTRATION_NO_FORMAT}${paddedId}`;

    await this.studentsRepository.save(student);
    return plainToInstance(StudentResponseDto, student);
  }

  async findAll() {
    return this.studentsRepository.findAll();
  }

  async findAllStudentsWithFilters(query: GetStudentsQueryDto) {
    const result = await this.studentsRepository.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(StudentResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async findOne(id: number): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return plainToInstance(StudentResponseDto, student);
  }

  async update(id: number, dto: UpdateStudentDto): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const userToUpdate = student.user;

    if (dto.fullName && student.fullName !== dto.fullName) {
      const uniqueUsername = await this.usersService.generateUniqueUsername(
        dto.fullName,
      );
      userToUpdate.username = uniqueUsername;
      student.fullName = dto.fullName;
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

    student.phone = dto.phone ?? student.phone;
    student.address = dto.address ?? student.address;
    student.gender = dto.gender ?? student.gender;

    const updatedStudent = await this.studentsRepository.save(student);
    return plainToInstance(StudentResponseDto, updatedStudent);
  }

  async remove(id: number): Promise<void> {
    const student = await this.studentsRepository.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    await this.studentsRepository.softDeleteStudent(student.id);
  }
}
