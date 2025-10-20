import { IsEnum, IsOptional } from 'class-validator';
import { ChatThreadType } from '../../../common';

export class CreateThreadDto {
  @IsEnum(ChatThreadType) type: ChatThreadType;
  @IsOptional() title?: string;
  @IsOptional() batchId?: number;
  @IsOptional() participantIds?: number[];
}
