import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  TRANSACTION_TYPES,
  type TransactionType as TransactionType,
} from '@app/common';

export class CreateTransactionDto {
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(TRANSACTION_TYPES, {
    message: 'Type must be income, expense or investment',
  })
  type: TransactionType;
}
