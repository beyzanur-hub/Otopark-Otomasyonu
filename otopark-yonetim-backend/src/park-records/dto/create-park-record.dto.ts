import { ApiProperty } from '@nestjs/swagger';

export class CreateParkRecordDto {
  @ApiProperty({ example: 1, description: 'Park eden Aracın ID numarası' })
  vehicleId: number;

  @ApiProperty({ example: 1, description: 'Park edilecek yerin (A-1) ID numarası' })
  parkingSpotId: number;

  @ApiProperty({ example: [1, 2], description: 'Uygulanacak Tarifelerin ID listesi (Örn: [1] Standart)' })
  tariffIds: number[]; // Çoka-Çok ilişki olduğu için liste (array) olarak alıyoruz
}