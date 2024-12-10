import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegerType, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async create(user: Partial<User>): Promise<User> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();

    // Memulai transaksi
    await queryRunner.startTransaction();
    try {
      // Buat user baru
      const newUser = this.userRepository.create(user);

      // Simpan user dalam transaksi
      const savedUser = await queryRunner.manager.save(newUser);

      // Commit transaksi jika berhasil
      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      // Rollback transaksi jika ada kesalahan
      await queryRunner.rollbackTransaction();
      throw error; // Melemparkan error agar bisa ditangani oleh handler
    } finally {
      // Menutup query runner
      await queryRunner.release();
    }
  }

  async findByNIK(nik: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { nik } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(nik: string, password: string): Promise<User | null> {
    const user = await this.findByNIK(nik);
    if (user && (await bcrypt.compare(password, user.password)) && user.isActive === 1) {
      return user; // Return user if password is valid
    }
    return null; // Return null if authentication fails
  }

  async getUserProfileById(userId: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const userProfileDto: UserProfileDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      nik: user.nik,
      hp: user.hp,
      jabatan: user.jabatan,
      isActive: user.isActive,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return userProfileDto;
  }

}

export class UserProfileDto {
  id: number;
  name: string;
  email: string;
  nik: string;
  hp: string;
  jabatan: string;
  isActive: number;
  created_at: Date;
  updated_at: Date;
}