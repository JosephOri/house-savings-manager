import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
  type TransactionType,
} from '@repo/shared';
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

export const RECURRENCE_INTERVALS = [
  'daily',
  'weekly',
  'monthly',
  'yearly',
] as const;
export type RecurrenceInterval = (typeof RECURRENCE_INTERVALS)[number];

@Entity()
export class RecurringTransaction extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Column({ type: 'varchar' })
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

  @ManyToOne(() => Household)
  @JoinColumn({ name: 'householdId' })
  household: Household;

  @Column({ type: 'varchar' })
  @IsIn(RECURRENCE_INTERVALS)
  interval: RecurrenceInterval;

  @Column()
  @IsDate()
  startDate: Date;

  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  lastRunDate?: Date;

  @Column()
  @IsDate()
  nextRunDate: Date;
}
