import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    
    @InjectRepository(User) // Kullanıcıyı kontrol etmek için buna da ihtiyacımız var
    private userRepository: Repository<User>,
  ) {}

  // ARAÇ EKLEME
  async create(createVehicleDto: CreateVehicleDto) {
    // 1. Önce böyle bir kullanıcı var mı diye bak
    const user = await this.userRepository.findOne({ where: { id: createVehicleDto.userId } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı!');
    }

    // 2. Aracı oluştur ve kullanıcıyı içine koy
    const newVehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      user: user, // İlişkiyi burada kuruyoruz
    });

    return await this.vehicleRepository.save(newVehicle);
  }

  // TÜM ARAÇLARI GETİR
  async findAll() {
    return await this.vehicleRepository.find({ relations: ['user'] }); // Sahibini de göster
  }

  // TEK ARAÇ GETİR
  async findOne(id: number) {
    return await this.vehicleRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }

  // GÜNCELLE
  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.vehicleRepository.update(id, updateVehicleDto);
    return this.findOne(id);
  }

  // SİL
  async remove(id: number) {
    await this.vehicleRepository.delete(id);
    return { message: `Araç #${id} silindi.` };
  }
}