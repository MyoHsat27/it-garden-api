import { Injectable } from '@nestjs/common';
import { CreateAttedanceRecordDto } from './dto/create-attedance-record.dto';
import { UpdateAttedanceRecordDto } from './dto/update-attedance-record.dto';

@Injectable()
export class AttedanceRecordsService {
  create(createAttedanceRecordDto: CreateAttedanceRecordDto) {
    return 'This action adds a new attedanceRecord';
  }

  findAll() {
    return `This action returns all attedanceRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attedanceRecord`;
  }

  update(id: number, updateAttedanceRecordDto: UpdateAttedanceRecordDto) {
    return `This action updates a #${id} attedanceRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} attedanceRecord`;
  }
}
