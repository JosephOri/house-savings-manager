import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household, FinancialOrder } from '@app/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
  imports: [TypeOrmModule.forFeature([Household, FinancialOrder]), JwtModule],
})
export class HouseholdModule {}
