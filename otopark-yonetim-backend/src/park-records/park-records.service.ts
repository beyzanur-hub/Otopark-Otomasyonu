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
    // 1. Araç var mı?
    const vehicle = await this.vehicleRepo.findOne({ where: { id: dto.vehicleId } });
    if (!vehicle) throw new NotFoundException('Araç bulunamadı!');

    // 2. Otopark yeri var mı?
    const spot = await this.spotRepo.findOne({ where: { id: dto.parkingSpotId } });
    if (!spot) throw new NotFoundException('Otopark yeri bulunamadı!');

    // 3. KRİTİK KONTROL: Yer dolu mu?
    if (spot.isOccupied) {
      throw new BadRequestException(`Seçilen yer (${spot.spotName}) şu an dolu!`);
    }

    // 4. Tarifeleri bul (Çoka çok ilişki)
    // const tariffs = await this.tariffRepo.findByIds(dto.tariffIds); // Eski sürüm
    const tariffs = await this.tariffRepo.findBy({
        id: In(dto.tariffIds),
    });

    // 5. Kaydı Oluştur
    const newRecord = this.parkRecordRepo.create({
      entryTime: new Date(), // Şu anın saati
      vehicle: vehicle,
      parkingSpot: spot,
      tariffs: tariffs,
    });

    // 6. Yeri "DOLU" olarak işaretle ve kaydet
    spot.isOccupied = true;
    await this.spotRepo.save(spot);

    return await this.parkRecordRepo.save(newRecord);
  }

  // --- OTOPARKTAN ÇIKIŞ İŞLEMİ (CHECK-OUT) ---
  // Standart update yerine özel bir metod yazıyoruz
  async checkOut(id: number) {
    // 1. Kaydı bul (Tarifeleriyle birlikte gelmeli ki fiyat hesaplayalım)
    const record = await this.parkRecordRepo.findOne({
      where: { id },
      relations: ['tariffs', 'parkingSpot'],
    });

    if (!record) throw new NotFoundException('Kayıt bulunamadı');
    if (record.exitTime) throw new BadRequestException('Bu araç zaten çıkış yapmış!');

    // 2. Çıkış saatini ayarla
    record.exitTime = new Date();

    // 3. Süreyi hesapla (Milisaniye farkını saate çevir)
    const diffMs = record.exitTime.getTime() - record.entryTime.getTime();
    const diffHours = Math.abs(diffMs / 36e5); // 1 saat = 36e5 ms. 
    // Örnek: 15 dakika kaldıysa 0.25 saat eder. En az 1 saat diyelim:
    const billableHours = Math.ceil(diffHours) || 1; 

    // 4. Fiyat Hesapla (Seçilen tarifelerin toplamı * saat)
    // Örn: Standart(50 TL) + VIP(20 TL) = 70 TL * 2 Saat = 140 TL
    let hourlyRate = 0;
    record.tariffs.forEach(t => hourlyRate += Number(t.pricePerHour));
    
    record.totalPrice = hourlyRate * billableHours;

    // 5. Yeri tekrar "BOŞ" yap
    const spot = record.parkingSpot;
    spot.isOccupied = false;
    await this.spotRepo.save(spot);

    // 6. Kaydı güncelle
    return await this.parkRecordRepo.save(record);
  }

  // --- LİSTELEME ---
  async findAll() {
    return await this.parkRecordRepo.find({
      relations: ['vehicle', 'parkingSpot', 'tariffs'], // Her şeyi göster
      order: { entryTime: 'DESC' } // En son giren en üstte
    });
  }

  async findOne(id: number) {
    return await this.parkRecordRepo.findOne({
        where: { id },
        relations: ['vehicle', 'parkingSpot', 'tariffs']
    });
  }
}