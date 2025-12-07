import { BaseEntity } from '@app/common';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column, Entity } from 'typeorm';

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
  @IsString()
  @IsOptional()
  description?: string;
}
