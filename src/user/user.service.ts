import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findByNIK(nik: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { nik } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(nik: string, password: string): Promise<User | null> {
    const user = await this.findByNIK(nik);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Return user if password is valid
    }
    return null; // Return null if authentication fails
  }

}
