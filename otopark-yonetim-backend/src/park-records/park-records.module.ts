import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkRecordsService } from './park-records.service';
import { ParkRecordsController } from './park-records.controller';
import { ParkRecord } from '../entities/park-record.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { ParkingSpot } from '../entities/parking-spot.entity';
import { Tariff } from '../entities/tariff.entity';

@Module({
  // Tüm bu tabloları kullanacağız:
  imports: [TypeOrmModule.forFeature([ParkRecord, Vehicle, ParkingSpot, Tariff])], 
  controllers: [ParkRecordsController],
  providers: [ParkRecordsService],
})
export class ParkRecordsModule {}