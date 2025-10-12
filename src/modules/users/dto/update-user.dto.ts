import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  IsOptional,
  IsStrongPassword,
  IsDate,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password: string | null;

  @ApiProperty({
    description: "The email of the user",
    example: "example@email.com",
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  refreshToken: string | null;

  @IsString()
  @IsOptional()
  passwordResetCode: string | null;

  @IsOptional()
  @IsDate()
  passwordResetExpires: Date | null;
}
