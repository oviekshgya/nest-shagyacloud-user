import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity'; // Pastikan path file sesuai
  
  @Entity('absen')
  export class Absen {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    location: string;
  
    @Column()
    fileSelfie: string;

    @Column()
    idUser: number;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
  
    @ManyToOne(() => User, (user) => user.absens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idUser' })
    user: User;
  }
  