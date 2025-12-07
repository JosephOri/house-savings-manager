import { Module, forwardRef } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialOrderModule } from './financial-order/financial-order.module';
import { Household, FinancialOrder } from '@app/common';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
  imports: [
    TypeOrmModule.forFeature([Household, FinancialOrder]),
    forwardRef(() => FinancialOrderModule),
  ],
})
export class HouseholdModule {}
