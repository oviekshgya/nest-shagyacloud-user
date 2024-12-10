import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('master_vendor')
export class MasterVendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 }) // `isActive` akan memiliki nilai default 1 (aktif)
  isActive: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;  // Tanggal dan waktu saat record dibuat

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;  // Tanggal dan waktu saat record diperbarui
}