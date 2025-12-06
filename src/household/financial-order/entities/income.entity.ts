import { Entity } from 'typeorm';
import { FinancialOrder } from './financial-order.entity';

@Entity()
export class Income extends FinancialOrder {}
