import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateParkRecordDto } from './dto/create-park-record.dto';
import { ParkRecord } from '../entities/park-record.entity';
import { ParkingSpot } from '../entities/parking-spot.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Tariff } from '../entities/tariff.entity';

@Injectable()
export class ParkRecordsService {
  constructor(
    @InjectRepository(ParkRecord)
    private parkRecordRepo: Repository<ParkRecord>,
    @InjectRepository(ParkingSpot)
    private spotRepo: Repository<ParkingSpot>,
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Tariff)
    private tariffRepo: Repository<Tariff>,
  ) {}

  // --- OTOPARKA GİRİŞ İŞLEMİ ---
  async create(dto: CreateParkRecordDto) {
    
    // 1. Araç var mı? (plateNumber ile ara)
    let vehicle = await this.vehicleRepo.findOne({ 
        where: { plateNumber: dto.plateNumber } 
    });

    // EĞER ARAÇ YOKSA -> OTOMATİK OLUŞTUR
    if (!vehicle) {
      vehicle = this.vehicleRepo.create({
        plateNumber: dto.plateNumber,
        model: 'Bilinmiyor',
        isParked: true,
        // user: null satırını SİLDİK. Yazmasak da veritabanı boş bırakır.
      });
      await this.vehicleRepo.save(vehicle);
    } else {
      // ARAÇ VARSA -> Zaten içeride mi?
      if (vehicle.isParked) {
        throw new BadRequestException(`Bu araç (${vehicle.plateNumber}) zaten otoparkta görünüyor!`);
      }
      vehicle.isParked = true;
      await this.vehicleRepo.save(vehicle);
    }

    // 2. Otopark yeri kontrolü
    const spot = await this.spotRepo.findOne({ where: { id: dto.parkingSpotId } });
    if (!spot) throw new NotFoundException('Otopark yeri bulunamadı!');

    if (spot.isOccupied) {
      throw new BadRequestException(`Seçilen yer (${spot.spotName}) şu an dolu!`);
    }

    // 3. Tarifeleri bul
    const tariffs = await this.tariffRepo.findBy({
      id: In(dto.tariffIds),
    });

    // 4. Kaydı Oluştur
    const newRecord = this.parkRecordRepo.create({
      entryTime: new Date(),
      vehicle: vehicle,
      parkingSpot: spot,
      tariffs: tariffs,
    });

    // 5. Yeri Dolu Yap
    spot.isOccupied = true;
    await this.spotRepo.save(spot);

    return await this.parkRecordRepo.save(newRecord);
  }

  // --- ÇIKIŞ İŞLEMİ ---
  async checkOut(id: number) {
    const record = await this.parkRecordRepo.findOne({
      where: { id },
      relations: ['tariffs', 'parkingSpot', 'vehicle'], 
    });

    if (!record) throw new NotFoundException('Kayıt bulunamadı');
    if (record.exitTime) throw new BadRequestException('Bu araç zaten çıkış yapmış!');

    record.exitTime = new Date();
    
    // Süre Hesaplama
    const diffMs = record.exitTime.getTime() - record.entryTime.getTime();
    const diffHours = Math.abs(diffMs / 36e5); 
    const billableHours = Math.ceil(diffHours) || 1; 

    // Ücret Hesaplama
    let hourlyRate = 0;
    if (record.tariffs) {
        record.tariffs.forEach(t => hourlyRate += Number(t.pricePerHour));
    }
    record.totalPrice = hourlyRate * billableHours;

    // Yeri Boşa Çıkar
    if (record.parkingSpot) {
        const spot = record.parkingSpot;
        spot.isOccupied = false;
        await this.spotRepo.save(spot);
    }

    // Aracı Dışarıda Göster
    if (record.vehicle) {
        const vehicle = record.vehicle;
        vehicle.isParked = false;
        await this.vehicleRepo.save(vehicle);
    }

    return await this.parkRecordRepo.save(record);
  }

  async findAll() {
    return this.parkRecordRepo.find({ relations: ['vehicle', 'parkingSpot', 'tariffs'], order: { entryTime: 'DESC' } });
  }

  async findOne(id: number) {
    return this.parkRecordRepo.findOne({ where: { id }, relations: ['vehicle', 'parkingSpot', 'tariffs'] });
  }
}