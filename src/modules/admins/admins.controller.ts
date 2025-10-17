import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  NotFoundException,
  Put,
  Logger,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  AdminResponseDto,
  GetAdminsQueryDto,
} from './dto';
import {
  CreateAdminDecorator,
  GetAllAdminsDecorator,
  GetAdminByIdDecorator,
  UpdateAdminDecorator,
  DeleteAdminDecorator,
} from './decorators';
import { JwtAuthGuard } from '../auth/guards';
import { PaginatedResponseDto } from '../../common';
import { plainToInstance } from 'class-transformer';

@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @CreateAdminDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminsService.create(dto);
    return plainToInstance(AdminResponseDto, admin);
  }

  @Get()
  @GetAllAdminsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<AdminResponseDto[]> {
    const admins = await this.adminsService.findAll();
    return plainToInstance(AdminResponseDto, admins);
  }

  @Get('filtered')
  @GetAllAdminsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAllAdminsWithFilters(
    @Query() query: GetAdminsQueryDto,
  ): Promise<PaginatedResponseDto<AdminResponseDto>> {
    return this.adminsService.findAllAdminsWithFilters(query);
  }

  @Get(':id')
  @GetAdminByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<AdminResponseDto> {
    const admin = await this.adminsService.findOne(+id);
    if (!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
    return plainToInstance(AdminResponseDto, admin);
  }

  @Put(':id')
  @UpdateAdminDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    const admin = await this.adminsService.update(+id, dto);
    if (!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
    return plainToInstance(AdminResponseDto, admin);
  }

  @Delete(':id')
  @DeleteAdminDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.adminsService.remove(+id);
  }
}
