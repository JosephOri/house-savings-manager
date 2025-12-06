import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';

@Module({
  controllers: [IncomeController],
  providers: [IncomeService],
  imports: [TypeOrmModule.forFeature([Income])],
})
export class IncomeModule {}
