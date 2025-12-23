import { type TransactionType } from '@repo/shared/src/typings';
import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  description?: string;

  @IsString()
  type: TransactionType;
}
