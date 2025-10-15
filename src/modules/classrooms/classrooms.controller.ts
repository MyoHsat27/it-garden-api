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
import { ClassroomsService } from './classrooms.service';
import {
  CreateClassroomDto,
  UpdateClassroomDto,
  ClassroomResponseDto,
} from './dto';
import {
  CreateClassroomDecorator,
  GetAllClassroomsDecorator,
  GetClassroomByIdDecorator,
  UpdateClassroomDecorator,
  DeleteClassroomDecorator,
} from './decorators/swagger.decorator';
import { JwtAuthGuard } from '../auth/guards';

@Controller('classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @CreateClassroomDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateClassroomDto): Promise<ClassroomResponseDto> {
    return await this.classroomsService.create(dto);
  }

  @Get()
  @GetAllClassroomsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ClassroomResponseDto[]> {
    return await this.classroomsService.findAll();
  }

  @Get(':id')
  @GetClassroomByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<ClassroomResponseDto> {
    return await this.classroomsService.findOne(id);
  }

  @Patch(':id')
  @UpdateClassroomDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateClassroomDto,
  ): Promise<ClassroomResponseDto> {
    return await this.classroomsService.update(id, dto);
  }

  @Delete(':id')
  @DeleteClassroomDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.classroomsService.remove(id);
  }
}
