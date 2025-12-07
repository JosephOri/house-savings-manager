import { FINANCIAL_ORDER_TYPES, type FinancialOrderType } from '@app/common';

import { BaseEntity } from './base.entity';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Household } from './household.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class FinancialOrder extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Column()
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @Column()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Column()
  @IsIn(FINANCIAL_ORDER_TYPES)
  type: FinancialOrderType;

  @Column()
  @IsString()
  @IsOptional()
  description?: string;

  @ManyToOne(() => Household, (household) => household.financialOrders)
  household: Household;
}
