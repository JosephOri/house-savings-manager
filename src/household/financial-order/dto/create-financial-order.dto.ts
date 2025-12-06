import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export abstract class CreateFinancialOrderDto {
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;
}
