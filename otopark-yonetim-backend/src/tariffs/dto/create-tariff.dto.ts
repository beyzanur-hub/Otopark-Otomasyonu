import { ApiProperty } from '@nestjs/swagger';

export class CreateTariffDto {
  @ApiProperty({ example: 'Standart Tarife', description: 'Tarife Adı' })
  name: string;

  @ApiProperty({ example: 50.00, description: 'Saatlik Ücret' })
  pricePerHour: number;
}