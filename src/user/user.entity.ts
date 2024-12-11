import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { MasterCompany } from 'src/master/master.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nik: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  hp: string;

  @Column()
  jabatan: string;

  @Column({ default: 1 }) // `isActive` akan memiliki nilai default 1 (aktif)
  isActive: number;

  @Column() // `isActive` akan memiliki nilai default 1 (aktif)
  idCompany: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;  // Tanggal dan waktu saat record dibuat

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;  // Tanggal dan waktu saat record diperbarui

  @ManyToOne(() => MasterCompany, (company) => company.users, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idCompany' })
  company: MasterCompany;
}


export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  hp: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  nik: string;

  @IsNotEmpty()
  jabatan: string;

  @IsNotEmpty()
  idCompany: number;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
