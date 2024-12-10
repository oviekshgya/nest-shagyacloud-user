import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService, } from './user.service';
import { User, CreateUserDto } from './user.entity';
import { classToPlain } from 'class-transformer';
import { createResponse } from 'src/pkg/response.utils';
import { JwtAuthGuard } from '../middleware/header.middleware';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<any> {
    const users: User[] = await this.userService.findAll();
   
    return createResponse("success", "users retrieved", classToPlain(users));
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<any> {
    const { name, email, password } = userData;

    // Periksa apakah email sudah digunakan
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      return createResponse("400", "email already exists", null);
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = await this.userService.create({
      name,
      email,
      password: hashedPassword,
    });

    return createResponse("200", "success", classToPlain(newUser));
  }
}