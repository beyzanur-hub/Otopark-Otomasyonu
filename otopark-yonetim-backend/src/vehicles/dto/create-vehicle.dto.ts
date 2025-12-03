import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: '34 ABC 123', description: 'Araç Plakası' })
  plateNumber: string;

  @ApiProperty({ example: 'Fiat Egea', description: 'Araç Marka/Modeli' })
  model: string;

  @ApiProperty({ example: 1, description: 'Araç sahibinin (User) ID numarası' })
  userId: number; // <-- Bu çok önemli! Aracı kime bağlayacağımızı buradan bileceğiz.
}