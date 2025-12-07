import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import type { FinancialOrderType } from '@app/common';

export class CreateFinancialOrderDto {
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  type: FinancialOrderType;
}
