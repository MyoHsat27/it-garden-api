import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AdminResponseDto, CreateAdminDto, UpdateAdminDto } from './dto';
import { AdminsRepository } from './admins.repository';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateAdminDto): Promise<AdminResponseDto> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const uniqueUsername = await this.usersService.generateUniqueUsername(
      dto.fullName,
    );

    const user = await this.usersService.create({
      username: uniqueUsername,
      email: dto.email,
      password: dto.password,
      userRole: UserRole.ADMIN,
    });

    const admin = await this.adminsRepository.save(
      this.adminsRepository.create({
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        user,
      }),
    );

    return plainToInstance(AdminResponseDto, admin);
  }

  async findAll(): Promise<AdminResponseDto[]> {
    const admins = await this.adminsRepository.findAll();
    return plainToInstance(AdminResponseDto, admins);
  }

  async findOne(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminsRepository.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    return plainToInstance(AdminResponseDto, admin);
  }

  async update(id: number, dto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminsRepository.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');

    Object.assign(admin, dto);
    const updated = await this.adminsRepository.save(admin);
    return plainToInstance(AdminResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const admin = await this.adminsRepository.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    await this.adminsRepository.deleteAdmin(id);
  }
}
