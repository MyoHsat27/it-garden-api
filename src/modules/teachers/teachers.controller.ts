import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import {
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherResponseDto,
  GetTeachersQueryDto,
} from './dto';
import {
  CreateTeacherDecorator,
  GetAllTeachersDecorator,
  GetTeacherByIdDecorator,
  UpdateTeacherDecorator,
  DeleteTeacherDecorator,
} from './decorators';
import { JwtAuthGuard } from '../auth/guards';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponseDto } from '../../common';

@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @CreateTeacherDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTeacherDto): Promise<TeacherResponseDto> {
    return await this.teachersService.create(dto);
  }

  @Get()
  @GetAllTeachersDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<TeacherResponseDto[]> {
    const teachers = await this.teachersService.findAll();
    return plainToInstance(TeacherResponseDto, teachers);
  }

  @Get('filtered')
  @GetAllTeachersDecorator()
  @HttpCode(HttpStatus.OK)
  async findAllTeachersWithFilters(
    @Query() query: GetTeachersQueryDto,
  ): Promise<PaginatedResponseDto<TeacherResponseDto>> {
    return this.teachersService.findAllTeachersWithFilters(query);
  }

  @Get(':id')
  @GetTeacherByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<TeacherResponseDto> {
    return await this.teachersService.findOne(id);
  }

  @Put(':id')
  @UpdateTeacherDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return await this.teachersService.update(id, dto);
  }

  @Delete(':id')
  @DeleteTeacherDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.teachersService.remove(id);
  }
}
