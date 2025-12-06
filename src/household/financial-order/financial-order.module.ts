import { Module } from '@nestjs/common';
import { FinancialOrderService } from './financial-order.service';
import { FinancialOrderController } from './financial-order.controller';

@Module({
  controllers: [FinancialOrderController],
  providers: [FinancialOrderService],
})
export class FinancialOrderModule {}
