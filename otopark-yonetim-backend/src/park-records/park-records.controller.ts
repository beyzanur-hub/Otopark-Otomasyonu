import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ParkRecordsService } from './park-records.service';
import { CreateParkRecordDto } from './dto/create-park-record.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Park Records (Giriş-Çıkış)')
@Controller('park-records')
export class ParkRecordsController {
  constructor(private readonly parkRecordsService: ParkRecordsService) {}

  @Post('entry') // URL: /park-records/entry
  @ApiOperation({ summary: 'Araç Giriş Yapıyor' })
  create(@Body() createParkRecordDto: CreateParkRecordDto) {
    return this.parkRecordsService.create(createParkRecordDto);
  }

  @Patch('checkout/:id') // URL: /park-records/checkout/1
  @ApiOperation({ summary: 'Araç Çıkış Yapıyor (Ücret Hesaplanır)' })
  checkOut(@Param('id') id: string) {
    return this.parkRecordsService.checkOut(+id);
  }

  @Get()
  findAll() {
    return this.parkRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkRecordsService.findOne(+id);
  }
}