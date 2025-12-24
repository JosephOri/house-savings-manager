import { type TransactionType } from '@repo/shared/src/typings';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsString()
  description?: string;

  @IsString()
  type: TransactionType;
}
