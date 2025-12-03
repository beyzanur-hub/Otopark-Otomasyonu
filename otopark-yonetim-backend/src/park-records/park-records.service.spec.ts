import { Test, TestingModule } from '@nestjs/testing';
import { ParkRecordsService } from './park-records.service';

describe('ParkRecordsService', () => {
  let service: ParkRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkRecordsService],
    }).compile();

    service = module.get<ParkRecordsService>(ParkRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
