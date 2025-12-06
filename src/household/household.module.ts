import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';
import { FinancialOrderModule } from './financial-order/financial-order.module';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
  imports: [FinancialOrderModule],
})
export class HouseholdModule {}
