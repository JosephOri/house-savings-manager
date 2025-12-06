import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class FinancialOrder {
  @PrimaryGeneratedColumn()
  id: number;

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
