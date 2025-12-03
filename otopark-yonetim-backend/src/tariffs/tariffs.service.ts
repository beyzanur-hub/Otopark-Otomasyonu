import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Tariff } from '../entities/tariff.entity';

@Injectable()
export class TariffsService {
  constructor(
    @InjectRepository(Tariff)
    private tariffRepository: Repository<Tariff>,
  ) {}

  create(createTariffDto: CreateTariffDto) {
    const newTariff = this.tariffRepository.create(createTariffDto);
    return this.tariffRepository.save(newTariff);
  }

  findAll() {
    return this.tariffRepository.find();
  }

  findOne(id: number) {
    return this.tariffRepository.findOne({ where: { id } });
  }

  update(id: number, updateTariffDto: UpdateTariffDto) {
    return this.tariffRepository.update(id, updateTariffDto);
  }

  remove(id: number) {
    return this.tariffRepository.delete(id);
  }
}