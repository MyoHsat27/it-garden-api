import { Controller, Get, Logger, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CurrentUser, GetCurrentUserDecorator } from "./decorators";
import { User } from "./entities";
import { JwtAuthGuard } from "../auth/guards";
import { UserDto } from "./dto";
import { plainToInstance } from "class-transformer";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  @GetCurrentUserDecorator()
  getMe(@CurrentUser() user: any): UserDto {
    return plainToInstance(UserDto, user);
  }
}
