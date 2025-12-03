import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plateNumber: string; // Plaka

  @Column()
  model: string; // Araç Modeli (Örn: Fiat Egea)

  // İLİŞKİ: Bir araç tek bir kullanıcıya aittir
  @ManyToOne(() => User, (user) => user.vehicles, { onDelete: 'CASCADE' }) 
  user: User;
}