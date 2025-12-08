import { Module } from '@nestjs/common';
import { FinancialOrderService } from './financial-order.service';
import { FinancialOrderController } from './financial-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Household, FinancialOrder, User } from '@app/common';

@Module({
  controllers: [FinancialOrderController],
  providers: [FinancialOrderService],
  imports: [
    TypeOrmModule.forFeature([Household, FinancialOrder, User]),
    JwtModule,
  ],
})
export class FinancialOrderModule {}
