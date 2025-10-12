import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";

export class RegisterLearnerDto {
  @ApiProperty({
    description: "The email of the user",
    example: "example@email.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    example: "StrongPassw0rd!",
    minLength: 5,
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: "The fullname of the user",
    example: "Mya Mya",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullName: string;
}
