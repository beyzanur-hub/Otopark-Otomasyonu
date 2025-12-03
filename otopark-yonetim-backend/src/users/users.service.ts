import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Veritabanı aracımız
  ) {}

  // KULLANICI OLUŞTURMA (Kayıt Ol)
  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  // TÜM KULLANICILARI GETİRME
  async findAll() {
    return await this.userRepository.find({ relations: ['vehicles'] }); 
    // relations: ['vehicles'] -> Kullanıcıyı getirirken araçlarını da göster demek!
  }

  // ID İLE TEK KULLANICI GETİRME
  async findOne(id: number) {
    return await this.userRepository.findOne({ 
      where: { id },
      relations: ['vehicles'] 
    });
  }

  // GÜNCELLEME
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  // SİLME
  async remove(id: number) {
    await this.userRepository.delete(id);
    return { message: `Kullanıcı #${id} başarıyla silindi.` };
  }
}