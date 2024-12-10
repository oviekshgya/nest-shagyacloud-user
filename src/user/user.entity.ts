import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users_req')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
