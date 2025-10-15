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
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, CourseResponseDto } from './dto';
import {
  CreateCourseDecorator,
  GetAllCoursesDecorator,
  GetCourseByIdDecorator,
  UpdateCourseDecorator,
  DeleteCourseDecorator,
} from './decorators/swagger.decorator';
import { JwtAuthGuard } from '../auth/guards';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @CreateCourseDecorator()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCourseDto): Promise<CourseResponseDto> {
    return this.coursesService.create(dto);
  }

  @Get()
  @GetAllCoursesDecorator()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<CourseResponseDto[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @GetCourseByIdDecorator()
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number): Promise<CourseResponseDto> {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UpdateCourseDecorator()
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @DeleteCourseDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.coursesService.remove(id);
  }
}
