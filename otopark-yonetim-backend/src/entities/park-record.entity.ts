import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ParkingSpot } from './parking-spot.entity';
import { Tariff } from './tariff.entity';

@Entity('park_records')
export class ParkRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entryTime: Date;

  @Column({ nullable: true })
  exitTime: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  // Burada da döngüsel bağımlılık hatası almamak için (spot: ParkingSpot) ekledik
  @ManyToOne(() => ParkingSpot, (spot: ParkingSpot) => spot.parkRecords)
  parkingSpot: ParkingSpot;

  @ManyToMany(() => Tariff)
  @JoinTable()
  tariffs: Tariff[];
}