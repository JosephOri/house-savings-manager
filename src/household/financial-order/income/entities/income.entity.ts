import { Entity } from 'typeorm';
import { FinancialOrder } from '../../entities/financial-order.entity';

@Entity()
export class Income extends FinancialOrder {}
