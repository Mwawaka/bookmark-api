import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '.prisma/client';
import { GetUser } from '../auth/decorators';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('test')
  getMe(@GetUser() user: User) {
    return user;
  }
}
