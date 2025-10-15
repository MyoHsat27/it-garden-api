import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto';
import {
  CreateTimeSlotDecorator,
  GetAllTimeSlotsDecorator,
  GetTimeSlotByIdDecorator,
  UpdateTimeSlotDecorator,
  DeleteTimeSlotDecorator,
} from './decorators/swagger.decorator';
import { JwtAuthGuard } from '../auth/guards';

@Controller('time-slots')
@UseGuards(JwtAuthGuard)
export class TimeSlotsController {
  constructor(private readonly service: TimeSlotsService) {}

  @Post()
  @CreateTimeSlotDecorator()
  async create(@Body() dto: CreateTimeSlotDto) {
    return this.service.create(dto);
  }

  @Get()
  @GetAllTimeSlotsDecorator()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @GetTimeSlotByIdDecorator()
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UpdateTimeSlotDecorator()
  async update(@Param('id') id: number, @Body() dto: UpdateTimeSlotDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @DeleteTimeSlotDecorator()
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
