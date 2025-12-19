import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { User } from '@app/common';
import { BaseEntity } from './base.entity';
import { Transaction } from './transaction.entity';
import { IsString } from 'class-validator';

@Entity()
@Unique(['adminId'])
export class Household extends BaseEntity {
  @OneToMany(() => Transaction, (transaction) => transaction.household)
  transaction: Transaction[];

  @Column()
  @IsString()
  adminId: string;

  @OneToMany(() => User, (user) => user.household)
  participants: User[];
}
