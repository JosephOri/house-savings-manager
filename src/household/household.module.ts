import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from './entities/household.entity';
import { FinancialOrderModule } from './financial-order/financial-order.module';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
  imports: [TypeOrmModule.forFeature([Household]), FinancialOrderModule],
})
export class HouseholdModule {}
