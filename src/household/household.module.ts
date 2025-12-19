import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household, Transaction, User } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
  imports: [
    TypeOrmModule.forFeature([Household, Transaction, User]),
    JwtModule,
    NotificationsModule,
  ],
})
export class HouseholdModule {}
