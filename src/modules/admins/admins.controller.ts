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
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from './dto';
import {
  CreateAdminDecorator,
  GetAllAdminsDecorator,
  GetAdminByIdDecorator,
  UpdateAdminDecorator,
  DeleteAdminDecorator,
} from './decorators';
import { JwtAuthGuard } from '../auth/guards';

@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @CreateAdminDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAdminDto): Promise<AdminResponseDto> {
    return await this.adminsService.create(dto);
  }

  @Get()
  @GetAllAdminsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<AdminResponseDto[]> {
    return await this.adminsService.findAll();
  }

  @Get(':id')
  @GetAdminByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<AdminResponseDto> {
    return await this.adminsService.findOne(id);
  }

  @Patch(':id')
  @UpdateAdminDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return await this.adminsService.update(id, dto);
  }

  @Delete(':id')
  @DeleteAdminDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.adminsService.remove(id);
  }
}
