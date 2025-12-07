import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';
import { ExpenseModule } from './financial-order/expense/expense.module';
import { IncomeModule } from './financial-order/income/income.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from './entities/household.entity';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
  imports: [ExpenseModule, IncomeModule, TypeOrmModule.forFeature([Household])],
})
export class HouseholdModule {}
