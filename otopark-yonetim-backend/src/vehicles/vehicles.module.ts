import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from '../entities/vehicle.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, User])], // <-- İKİSİNİ DE EKLEDİK
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}