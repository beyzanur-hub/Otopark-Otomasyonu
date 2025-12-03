import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ParkRecord } from '../entities/park-record.entity'; 

@Entity('parking_spots')
export class ParkingSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  spotName: string; // Örn: "A-1", "B-5"

  @Column({ default: false })
  isOccupied: boolean; // Dolu mu? (True/False)

  // Bir yerin geçmişte birçok park kaydı olabilir
  @OneToMany(() => ParkRecord, (parkRecord: ParkRecord) => parkRecord.parkingSpot)
  parkRecords: ParkRecord[];
}