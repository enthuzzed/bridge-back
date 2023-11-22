import { Test, TestingModule } from '@nestjs/testing';
import { RossetaApiService } from './rosseta-api.service';

describe('RossetaApiService', () => {
  let service: RossetaApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RossetaApiService],
    }).compile();

    service = module.get<RossetaApiService>(RossetaApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
