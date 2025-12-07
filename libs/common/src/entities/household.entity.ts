import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '@app/common';
import { BaseEntity } from './base.entity';
import { FinancialOrder } from './financial-order.entity';
import { IsString } from 'class-validator';

@Entity()
export class Household extends BaseEntity {
  @OneToMany(() => FinancialOrder, (financialOrder) => financialOrder.household)
  financialOrders: FinancialOrder[];

  @Column()
  @IsString()
  adminId: string;

  @OneToMany(() => User, (user) => user.household)
  participants: User[];
}
