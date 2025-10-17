import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  AdminResponseDto,
  CreateAdminDto,
  GetAdminsQueryDto,
  UpdateAdminDto,
} from './dto';
import { AdminsRepository } from './admins.repository';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums';
import { CryptoHelper, PaginatedResponseDto } from '../../common';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async create(dto: CreateAdminDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const role = await this.rolesService.findById(dto.roleId);
    if (!role)
      throw new NotFoundException(`Role with ID ${dto.roleId} does not exists`);

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
        gender: dto.gender,
        user,
        role,
      }),
    );

    return admin;
  }

  async findAll() {
    return this.adminsRepository.findAll();
  }

  async findAllAdminsWithFilters(query: GetAdminsQueryDto) {
    const result = await this.adminsRepository.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(AdminResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async findOne(id: number) {
    return this.adminsRepository.findById(id);
  }

  async findCountByRoleId(id: number) {
    return this.adminsRepository.findCountByRoleId(id);
  }

  async update(id: number, dto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminsRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const userToUpdate = admin.user;

    if (dto.fullName && admin.fullName !== dto.fullName) {
      const uniqueUsername = await this.usersService.generateUniqueUsername(
        dto.fullName,
      );
      userToUpdate.username = uniqueUsername;
      admin.fullName = dto.fullName;
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

    admin.phone = dto.phone ?? admin.phone;
    admin.address = dto.address ?? admin.address;
    admin.gender = dto.gender ?? admin.gender;

    if (dto.roleId && admin.role?.id !== dto.roleId) {
      const role = await this.rolesService.findById(dto.roleId);
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${dto.roleId} does not exist`,
        );
      }
      admin.role = role;
    }

    const updatedAdmin = await this.adminsRepository.save(admin);
    return plainToInstance(AdminResponseDto, updatedAdmin);
  }

  async remove(id: number): Promise<void> {
    const admin = await this.adminsRepository.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    await this.adminsRepository.softDeleteAdmin(admin.id);
  }
}
