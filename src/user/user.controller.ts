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
    const { name, email, password, hp } = userData;

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
      isActive: 1, // Set isActive menjadi 1 (aktif) pada saat registrasi
      hp: hp, // Tambahkan field hp pada user
    });

    return createResponse("200", "success", classToPlain(newUser));
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;

    // Validasi user
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      return createResponse("200", "password / email salah", null);
    }

    // Buat JWT
    const payload = { sub: user.id, email: user.email };
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