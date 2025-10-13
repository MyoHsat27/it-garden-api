import { Module } from '@nestjs/common';
import { AttedanceRecordsService } from './attedance-records.service';
import { AttedanceRecordsController } from './attedance-records.controller';

@Module({
  controllers: [AttedanceRecordsController],
  providers: [AttedanceRecordsService],
})
export class AttedanceRecordsModule {}
