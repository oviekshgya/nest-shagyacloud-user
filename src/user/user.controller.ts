import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService, } from './user.service';
import { User, CreateUserDto } from './user.entity';
import { classToPlain } from 'class-transformer';
import { createResponse } from 'src/pkg/response.utils';
import { JwtAuthGuard } from '../middleware/header.middleware';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<any> {
    const users: User[] = await this.userService.findAll();
   
    return createResponse("success", "users retrieved", classToPlain(users));
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<any> {
    const { name, email, password, hp, nik } = userData;

    // Periksa apakah email sudah digunakan
    const existingUser = await this.userService.findByNIK(nik);
    if (existingUser) {
      return createResponse("error", "nik already exists", null);
    }

    const existingUserEmail = await this.userService.findByEmail(email);
    if (existingUserEmail) {
      return createResponse("error", "email already exists", null);
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      isActive: 1,
      hp: hp,
      nik,
    });

    return createResponse("200", "success", classToPlain(newUser));
  }

  @Post('login')
  async login(@Body() loginDto: { nik: string; password: string }) {
    const { nik, password } = loginDto;

    // Validasi user
    const user = await this.userService.validateUser(nik, password);
    if (!user) {
      return createResponse("200", "password / email salah", null);
    }

    // Buat JWT
    const payload = { sub: user.id, email: user.nik };
    const token = this.jwtService.sign(payload); // Pastikan menggunakan JwtService

    // return {
    //   message: 'Login successful',
    //   token: token,
    // };
    return createResponse("200", "Login successful", {
      token: token,
      });
  }

  
}