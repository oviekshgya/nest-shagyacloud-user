import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { classToPlain } from 'class-transformer';
import { createResponse } from 'src/pkg/response.utils';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<any> {
    const users: User[] = await this.userService.findAll();
   
    return createResponse("success", "users retrieved", classToPlain(users));
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }
}