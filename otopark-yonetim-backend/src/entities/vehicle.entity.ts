import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity'; 

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plateNumber: string;

  @Column()
  model: string;

  @Column({ default: true }) 
  isParked: boolean;

  // DÜZELTME BURADA: nullable: true EKLENDİ
  // Artık bir aracın kullanıcısı olmak zorunda değil (Misafir girişleri için)
  @ManyToOne(() => User, (user) => user.vehicles, { onDelete: 'CASCADE', nullable: true })
  user: User;
}