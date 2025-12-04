import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: '34 ABC 123', description: 'Araç Plakası' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string; // <-- GERİ GELDİ: plateNumber

  @ApiProperty({ example: 'Fiat Egea', description: 'Araç Marka/Modeli' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 1, description: 'Araç sahibinin ID numarası' })
  @IsNumber()
  @IsNotEmpty()
  userId: number; 
}