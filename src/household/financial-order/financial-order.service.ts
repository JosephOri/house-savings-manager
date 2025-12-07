import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from '@app/common';
import { FinancialOrder } from '../../../libs/common/src/entities/financial-order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FinancialOrderService extends AbstractCrudService<FinancialOrder> {
  constructor(
    @InjectRepository(FinancialOrder)
    private readonly financialOrderRepository: Repository<FinancialOrder>,
  ) {
    super(financialOrderRepository);
  }
}
