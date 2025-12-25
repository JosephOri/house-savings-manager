import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
  type TransactionType,
} from '@repo/shared';
import { IsNumber, IsOptional, IsString, IsIn, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 100, description: 'The amount of the transaction' })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'groceries',
    description: 'The category of the transaction',
  })
  @IsString()
  @IsIn(INCOME_CATEGORIES || EXPENSE_CATEGORIES)
  category: string;

  @ApiProperty({
    example: '2023-10-27T10:00:00Z',
    description: 'The date of the transaction',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiProperty({
    example: 'Weekly grocery shopping',
    description: 'Description',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'expense',
    description: 'The type of transaction (income or expense)',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(TRANSACTION_TYPES)
  type: TransactionType;
}
