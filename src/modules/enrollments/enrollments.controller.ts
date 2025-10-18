import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
  Logger,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from './dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import {
  CreateEnrollmentDecorator,
  GetAllEnrollmentsDecorator,
  GetEnrollmentByIdDecorator,
  UpdateEnrollmentDecorator,
  DeleteEnrollmentDecorator,
} from './decorators/swagger.decorator';
import { GetEnrollmentsQueryDto } from './dto/get-enrollments-query.dto';
import { PaginatedResponseDto } from '../../common';
import { PaidEnrollmentDto } from './dto/paid-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post()
  @CreateEnrollmentDecorator()
  create(@Body() dto: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    return this.service.create(dto);
  }

  @Post(':id/paid')
  @CreateEnrollmentDecorator()
  paidEnrollment(
    @Param('id') id: number,
    @Body() dto: PaidEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    return this.service.paidEnrollment(id, dto);
  }

  @Get()
  @GetAllEnrollmentsDecorator()
  findAll(): Promise<EnrollmentResponseDto[]> {
    return this.service.findAll();
  }

  @Get('filtered')
  @GetAllEnrollmentsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAllCoursesWithFilters(
    @Query() query: GetEnrollmentsQueryDto,
  ): Promise<PaginatedResponseDto<EnrollmentResponseDto>> {
    return this.service.findAllEnrollmentsWithFilters(query);
  }

  @Get(':id')
  @GetEnrollmentByIdDecorator()
  findOne(@Param('id') id: number): Promise<EnrollmentResponseDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UpdateEnrollmentDecorator()
  update(
    @Param('id') id: number,
    @Body() dto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @DeleteEnrollmentDecorator()
  remove(@Param('id') id: number): Promise<void> {
    return this.service.remove(id);
  }
}
