import { Test, TestingModule } from '@nestjs/testing';
import { ParkRecordsController } from './park-records.controller';
import { ParkRecordsService } from './park-records.service';

describe('ParkRecordsController', () => {
  let controller: ParkRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkRecordsController],
      providers: [ParkRecordsService],
    }).compile();

    controller = module.get<ParkRecordsController>(ParkRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
