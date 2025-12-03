import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tariffs')
export class Tariff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Örn: "Standart Tarife", "Haftasonu", "VIP"

  @Column('decimal', { precision: 10, scale: 2 }) 
  pricePerHour: number; // Saatlik Ücret (Para birimi olduğu için decimal yaptık)
}