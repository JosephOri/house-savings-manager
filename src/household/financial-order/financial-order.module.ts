import { Module } from '@nestjs/common';
import { FinancialOrderService } from './financial-order.service';
import { FinancialOrderController } from './financial-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialOrder, Household } from '@app/common';

@Module({
  controllers: [FinancialOrderController],
  providers: [FinancialOrderService],
  imports: [TypeOrmModule.forFeature([FinancialOrder, Household])],
})
export class FinancialOrderModule {}
