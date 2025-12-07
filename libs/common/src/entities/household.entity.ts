import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { User } from '@app/common';
import { BaseEntity } from './base.entity';
import { FinancialOrder } from './financial-order.entity';
import { IsString } from 'class-validator';

@Entity()
@Unique(['adminId'])
export class Household extends BaseEntity {
  @OneToMany(() => FinancialOrder, (financialOrder) => financialOrder.household)
  financialOrders: FinancialOrder[];

  @Column()
  @IsString()
  adminId: string;

  @OneToMany(() => User, (user) => user.household)
  participants: User[];
}
