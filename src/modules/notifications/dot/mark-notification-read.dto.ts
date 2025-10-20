import { IsNumber } from 'class-validator';

export class MarkNotificationReadDto {
  @IsNumber() id: number;
}
