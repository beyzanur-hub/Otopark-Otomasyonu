import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

// --- ENTITY'LER ---
import { User } from './entities/user.entity';
import { Vehicle } from './entities/vehicle.entity';
import { ParkingSpot } from './entities/parking-spot.entity';
import { Tariff } from './entities/tariff.entity';
import { ParkRecord } from './entities/park-record.entity';

// --- MODÜLLER ---
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ParkRecordsModule } from './park-records/park-records.module';
import { TariffsModule } from './tariffs/tariffs.module';
import { ParkingSpotsModule } from './parking-spots/parking-spots.module';

@Module({
  imports: [
    // ---- ENV LOAD ----
    ConfigModule.forRoot(),

    // ---- TYPEORM AYARLARI ----
    TypeOrmModule.forRoot({
      type: 'postgres',

      // Eğer Render/Docker gibi bir ortam DATABASE_URL veriyorsa onu kullan:
      url: process.env.DATABASE_URL,

      // LOCAL ÇALIŞMA modunda burası geçerli olur:
      host: process.env.DATABASE_URL ? undefined : 'localhost',
      port: process.env.DATABASE_URL ? undefined : 5432,
      username: process.env.DATABASE_URL ? undefined : 'postgres',
      password: process.env.DATABASE_URL ? undefined : '123456',
      database: process.env.DATABASE_URL ? undefined : 'OtoparkDB',

      // Entity Tanımları
      entities: [User, Vehicle, ParkingSpot, Tariff, ParkRecord],
      autoLoadEntities: false,

      synchronize: true, // Ödev için açık bırakıyoruz

      // Render Postgres SSL zorunlu
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),

    // ---- DİĞER MODÜLLER ----
    UsersModule,
    VehiclesModule,
    ParkRecordsModule,
    TariffsModule,
    ParkingSpotsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
