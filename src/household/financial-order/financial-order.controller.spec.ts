import { Test, TestingModule } from '@nestjs/testing';
import { FinancialOrderController } from './financial-order.controller';
import { FinancialOrderService } from './financial-order.service';

describe('FinancialOrderController', () => {
  let controller: FinancialOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialOrderController],
      providers: [FinancialOrderService],
    }).compile();

    controller = module.get<FinancialOrderController>(FinancialOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
