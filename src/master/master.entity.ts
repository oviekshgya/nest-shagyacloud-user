import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.entity';

@Entity('master_vendor')
export class MasterVendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  @Exclude()
  isActive: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  created_at: Date;  // Tanggal dan waktu saat record dibuat

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updated_at: Date;  // Tanggal dan waktu saat record diperbarui
}


@Entity('master_jabatan')
export class MasterJabatan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  @Exclude()
  isActive: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  created_at: Date;  // Tanggal dan waktu saat record dibuat

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updated_at: Date;  // Tanggal dan waktu saat record diperbarui
}

@Entity('master_company')
export class MasterCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  @Exclude()
  isActive: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  created_at: Date;  // Tanggal dan waktu saat record dibuat

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updated_at: Date;  // Tanggal dan waktu saat record diperbarui

  @OneToOne(() => User, (user) => user.company)
  users: User[];
}