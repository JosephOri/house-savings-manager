import { BaseEntity } from '@app/common';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export abstract class FinancialOrder extends BaseEntity {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  amount: number;

  @Column()
  @IsDate()
  date: Date;

  @Column()
  @IsString()
  category: string;

  @Column()
  @IsString()
  @IsOptional()
  description?: string;
}
