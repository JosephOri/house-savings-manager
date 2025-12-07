import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FINANCIAL_ORDER_TYPES, type FinancialOrderType } from '@app/common';

export class CreateFinancialOrderDto {
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  householdId: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(FINANCIAL_ORDER_TYPES, {
    message: 'Type must be income, expense or investment',
  })
  type: FinancialOrderType;
}
