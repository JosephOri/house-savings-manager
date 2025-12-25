import { type TransactionType } from '@repo/shared/src/typings';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsString()
  description?: string;

  @IsString()
  type: TransactionType;
}
