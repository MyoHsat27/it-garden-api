import { PartialType } from '@nestjs/swagger';
import { CreateAttedanceRecordDto } from './create-attedance-record.dto';

export class UpdateAttedanceRecordDto extends PartialType(CreateAttedanceRecordDto) {}
