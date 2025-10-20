import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNumber() threadId: number;
  @IsString() body: string;
  @IsOptional() attachment?: Express.Multer.File;
}
