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
  Put,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  StudentResponseDto,
  GetStudentsQueryDto,
} from './dto';
import {
  CreateStudentDecorator,
  GetAllStudentsDecorator,
  GetStudentByIdDecorator,
  UpdateStudentDecorator,
  DeleteStudentDecorator,
} from './decorators';
import { JwtAuthGuard } from '../auth/guards';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponseDto } from '../../common';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @CreateStudentDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStudentDto): Promise<StudentResponseDto> {
    return await this.studentsService.create(dto);
  }

  @Get()
  @GetAllStudentsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<StudentResponseDto[]> {
    const students = await this.studentsService.findAll();
    return plainToInstance(StudentResponseDto, students);
  }

  @Get('filtered')
  @GetAllStudentsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAllStudentsWithFilters(
    @Query() query: GetStudentsQueryDto,
  ): Promise<PaginatedResponseDto<StudentResponseDto>> {
    return this.studentsService.findAllStudentsWithFilters(query);
  }

  @Get(':id')
  @GetStudentByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<StudentResponseDto> {
    return await this.studentsService.findOne(id);
  }

  @Put(':id')
  @UpdateStudentDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return await this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @DeleteStudentDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.studentsService.remove(id);
  }
}
