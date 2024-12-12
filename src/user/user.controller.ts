import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UserService, UserProfileDto } from './user.service';
import { User, CreateUserDto } from './user.entity';
import { classToPlain } from 'class-transformer';
import { createResponse } from 'src/pkg/response.utils';
import { JwtAuthGuard } from '../middleware/header.middleware';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Absen } from './absen.entity';

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
  }c

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<any> {
    const { name, email, password, hp, nik, jabatan, idCompany } = userData;

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
      jabatan,
      idCompany,
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
    const payload = { sub: user.id, nik: user.nik };
    const token = this.jwtService.sign(payload); // Pastikan menggunakan JwtService

    
    return createResponse("200", "Login successful", {
      token: token,
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req): Promise<any> {
    const data: UserProfileDto = await this.userService.getUserProfileById(req.user.sub);
    return createResponse("success", "data retrieved", data);
  }

  @Get("absen")
  @UseGuards(JwtAuthGuard)
  async findAllCompany(@Req() req): Promise<any> {
    const master: Absen[] = await this.userService.findAllAbsen(req.user.sub);
    if (master.length<= 0) {
      return createResponse("error", "Data master company kosong", null);
    }
   
    return createResponse("success", "data retrieved", classToPlain(master));
  }
  
}