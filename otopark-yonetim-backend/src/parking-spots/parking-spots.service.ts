import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import { ParkingSpot } from '../entities/parking-spot.entity';

@Injectable()
export class ParkingSpotsService {
  constructor(
    @InjectRepository(ParkingSpot)
    private spotRepository: Repository<ParkingSpot>,
  ) {}

  // YER OLUŞTUR
  create(createParkingSpotDto: CreateParkingSpotDto) {
    const newSpot = this.spotRepository.create(createParkingSpotDto);
    return this.spotRepository.save(newSpot);
  }

  // TÜMÜNÜ LİSTELE
  findAll() {
    return this.spotRepository.find();
  }

  // TEK BİR YERİ BUL
  findOne(id: number) {
    return this.spotRepository.findOne({ where: { id } });
  }

  // GÜNCELLE
  update(id: number, updateParkingSpotDto: UpdateParkingSpotDto) {
    return this.spotRepository.update(id, updateParkingSpotDto);
  }

  // SİL
  remove(id: number) {
    return this.spotRepository.delete(id);
  }
}