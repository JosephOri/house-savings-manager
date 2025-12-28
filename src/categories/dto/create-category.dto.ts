import { TRANSACTION_TYPES, type TransactionType } from '@repo/shared';
import { Transform } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  value: string;

  @IsString()
  userId: string;

  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(TRANSACTION_TYPES)
  type: TransactionType;
}
