import { IsNotEmpty, IsArray, IsString, IsNumber } from 'class-validator';

export class CreateParkRecordDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string; // <-- GERİ GELDİ: plateNumber

  @IsNumber()
  @IsNotEmpty()
  parkingSpotId: number;

  @IsArray()
  tariffIds: number[];
}