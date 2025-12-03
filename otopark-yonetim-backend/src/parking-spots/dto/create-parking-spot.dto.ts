import { ApiProperty } from '@nestjs/swagger';

export class CreateParkingSpotDto {
  @ApiProperty({ example: 'A-1', description: 'Otopark yerinin adı veya numarası' })
  spotName: string;

  @ApiProperty({ example: false, description: 'Başlangıçta dolu mu? (Genelde false olur)' })
  isOccupied: boolean;
}