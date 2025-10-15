import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-records.service';
import { CreateAttendanceRecordDto, UpdateAttendanceRecordDto } from './dto';
import {
  CreateAttendanceRecordDecorator,
  DeleteAttendanceRecordDecorator,
  GetAllAttendanceRecordsDecorator,
  GetAttendanceRecordByIdDecorator,
  UpdateAttendanceRecordDecorator,
} from './decorators';
import { JwtAuthGuard } from '../auth/guards';

@Controller('attendance-records')
@UseGuards(JwtAuthGuard)
export class AttendanceRecordsController {
  constructor(private readonly service: AttendanceRecordsService) {}

  @Post()
  @CreateAttendanceRecordDecorator()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAttendanceRecordDto) {
    return this.service.create(dto);
  }

  @Get()
  @GetAllAttendanceRecordsDecorator()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @GetAttendanceRecordByIdDecorator()
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UpdateAttendanceRecordDecorator()
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: UpdateAttendanceRecordDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @DeleteAttendanceRecordDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
