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
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  householdId: string;

  @ManyToOne(() => Household, (household) => household.financialOrders)
  @JoinColumn({ name: 'householdId' })
  household: Household;
}
