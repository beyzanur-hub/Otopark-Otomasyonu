import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 1. ARAÇ EKLEME
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    
    // KONTROL: Aynı plaka (plateNumber) içeride mi?
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { 
        plateNumber: createVehicleDto.plateNumber, // <-- DÜZELDİ
        isParked: true 
      }
    });

    if (existingVehicle) {
      throw new BadRequestException(`Bu araç (${createVehicleDto.plateNumber}) zaten otoparkta!`);
    }

    const user = await this.userRepository.findOne({
      where: { id: createVehicleDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı!');
    }

    const newVehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      user: user,
      isParked: true, 
    });

    return this.vehicleRepository.save(newVehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!vehicle) throw new NotFoundException(`Vehicle #${id} not found`);
    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    await this.vehicleRepository.update(id, updateVehicleDto);
    return this.findOne(id);
  }

  async exitParking(id: number): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    if (!vehicle.isParked) throw new BadRequestException('Bu araç zaten çıkış yapmış!');
    
    vehicle.isParked = false;
    await this.vehicleRepository.save(vehicle);
    return vehicle;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.vehicleRepository.delete(id);
    return { message: `Araç #${id} silindi.` };
  }
}