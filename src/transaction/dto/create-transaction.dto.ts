import { type TransactionType } from '@repo/shared/src/typings';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 100, description: 'The amount of the transaction' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'groceries',
    description: 'The category of the transaction',
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: '2023-10-27T10:00:00Z',
    description: 'The date of the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({
    example: 'Weekly grocery shopping',
    description: 'Description',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'EXPENSE',
    description: 'The type of transaction (INCOME or EXPENSE)',
  })
  @IsString()
  type: TransactionType;
}
