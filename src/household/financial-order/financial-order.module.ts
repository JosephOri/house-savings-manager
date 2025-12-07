import { Module } from '@nestjs/common';
import { FinancialOrderService } from './financial-order.service';
import { FinancialOrderController } from './financial-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialOrder } from './entities/financial-order.entity';

@Module({
  controllers: [FinancialOrderController],
  providers: [FinancialOrderService],
  imports: [TypeOrmModule.forFeature([FinancialOrder])],
})
export class FinancialOrderModule {}
