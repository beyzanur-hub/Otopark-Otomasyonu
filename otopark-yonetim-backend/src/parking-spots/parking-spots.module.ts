import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpotsService } from './parking-spots.service';
import { ParkingSpotsController } from './parking-spots.controller';
import { ParkingSpot } from '../entities/parking-spot.entity'; // Ana entity klasöründen çektik

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpot])], // <-- Tabloyu bağladık
  controllers: [ParkingSpotsController],
  providers: [ParkingSpotsService],
  exports: [ParkingSpotsService], // Başka modüller (ParkRecords) kullanabilsin diye dışarı açtık
})
export class ParkingSpotsModule {}