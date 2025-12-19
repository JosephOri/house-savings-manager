import { TRANSACTION_TYPES, type TransactionType } from '@app/common';

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
export class Transaction extends BaseEntity {
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
  @IsIn(TRANSACTION_TYPES)
  type: TransactionType;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  householdId: string;

  @ManyToOne(() => Household, (household) => household.transaction)
  @JoinColumn({ name: 'householdId' })
  household: Household;
}
