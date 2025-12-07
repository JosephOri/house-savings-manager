import { Entity } from 'typeorm';
import { FinancialOrder } from '../../../../../libs/common/src/entities/financial-order.entity';

@Entity()
export class Expense extends FinancialOrder {}
