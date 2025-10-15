import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { CreateTimetableDto, UpdateTimetableDto } from './dto';
import { TimetableResponseDto } from './dto/timetable-response.dto';
import {
  CreateTimetableDecorator,
  GetAllTimetablesDecorator,
  GetTimetableByIdDecorator,
  UpdateTimetableDecorator,
  DeleteTimetableDecorator,
} from './decorators/swagger.decorator';
import { JwtAuthGuard } from '../auth/guards';

@Controller('timetables')
@UseGuards(JwtAuthGuard)
export class TimetablesController {
  constructor(private readonly service: TimetablesService) {}

  @Post()
  @CreateTimetableDecorator()
  async create(@Body() dto: CreateTimetableDto) {
    return this.service.create(dto);
  }

  @Get()
  @GetAllTimetablesDecorator()
  async findAll(): Promise<TimetableResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @GetTimetableByIdDecorator()
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UpdateTimetableDecorator()
  async update(@Param('id') id: number, @Body() dto: UpdateTimetableDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @DeleteTimetableDecorator()
  async remove(@Param('id') id: number): Promise<void> {
    return this.service.remove(id);
  }
}
