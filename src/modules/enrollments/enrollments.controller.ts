import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
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

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post()
  @CreateEnrollmentDecorator()
  create(@Body() dto: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @GetAllEnrollmentsDecorator()
  findAll(): Promise<EnrollmentResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @GetEnrollmentByIdDecorator()
  findOne(@Param('id') id: number): Promise<EnrollmentResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
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
