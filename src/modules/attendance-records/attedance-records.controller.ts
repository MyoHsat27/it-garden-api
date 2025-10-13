import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttedanceRecordsService } from './attedance-records.service';
import { CreateAttedanceRecordDto } from './dto/create-attedance-record.dto';
import { UpdateAttedanceRecordDto } from './dto/update-attedance-record.dto';

@Controller('attedance-records')
export class AttedanceRecordsController {
  constructor(private readonly attedanceRecordsService: AttedanceRecordsService) {}

  @Post()
  create(@Body() createAttedanceRecordDto: CreateAttedanceRecordDto) {
    return this.attedanceRecordsService.create(createAttedanceRecordDto);
  }

  @Get()
  findAll() {
    return this.attedanceRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attedanceRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttedanceRecordDto: UpdateAttedanceRecordDto) {
    return this.attedanceRecordsService.update(+id, updateAttedanceRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attedanceRecordsService.remove(+id);
  }
}
