import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {
  Household,
  RecurringTransaction,
  Transaction,
  User,
} from '@app/common';
import { RecurringTransactionService } from './recurring-transaction.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, RecurringTransactionService],
  imports: [
    TypeOrmModule.forFeature([
      Household,
      Transaction,
      User,
      RecurringTransaction,
    ]),
    JwtModule,
    ScheduleModule.forRoot(),
  ],
})
export class TransactionModule {}
