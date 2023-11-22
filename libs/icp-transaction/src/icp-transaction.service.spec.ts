import { Test, TestingModule } from '@nestjs/testing';
import { IcpTransactionService } from './icp-transaction.service';

describe('IcpTransactionService', () => {
  let service: IcpTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IcpTransactionService],
    }).compile();

    service = module.get<IcpTransactionService>(IcpTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
