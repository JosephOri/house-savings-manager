import { Test, TestingModule } from '@nestjs/testing';
import { FinancialOrderService } from './financial-order.service';

describe('FinancialOrderService', () => {
  let service: FinancialOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialOrderService],
    }).compile();

    service = module.get<FinancialOrderService>(FinancialOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
