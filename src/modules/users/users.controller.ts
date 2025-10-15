import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, GetCurrentUserDecorator } from './decorators';
import { JwtAuthGuard } from '../auth/guards';
import { UserResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @GetCurrentUserDecorator()
  getMe(@CurrentUser() user: any): UserResponseDto {
    return plainToInstance(UserResponseDto, user);
  }
}
