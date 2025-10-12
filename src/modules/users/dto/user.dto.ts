import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities";

export class UserDto {
  @ApiProperty({
    description: "The id of the user",
    example: 2,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "The username of the user",
    example: "mya_mya",
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: "The email of the user",
    example: "example@email.com",
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: "The ban status of the user",
    example: true,
  })
  @Expose()
  isBanned: boolean;

  @ApiProperty({
    description: "The onboarding status of the user",
    example: true,
  })
  @Expose()
  hasCompletedOnboarding: boolean;

  @ApiProperty({
    description: "The email verify status of the user",
    example: true,
  })
  @Expose()
  isEmailVerified: boolean;
}
