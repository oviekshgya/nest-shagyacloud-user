import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { Absen } from './absen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Absen]),  
    JwtModule.register({
    secret: process.env.JWT_SECRET || 'defaultSecretKey', // Ganti sesuai environment
    signOptions: { expiresIn: '1h' }, // Atur masa berlaku token
  }),], // Daftarkan entity
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
