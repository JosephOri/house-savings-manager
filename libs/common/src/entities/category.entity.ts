import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IsIn, IsString } from 'class-validator';
import { TRANSACTION_TYPES, type TransactionType } from '@repo/shared';

@Entity()
export class Category extends BaseEntity {
  @Column()
  @IsString()
  value: string;

  @Column({ nullable: true })
  @IsString()
  userId: string;

  @Column({ type: 'varchar' })
  @IsIn(TRANSACTION_TYPES)
  type: TransactionType;
}
