import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from '@app/common';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpenseService extends AbstractCrudService<Expense> {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {
    super(expenseRepository);
  }
}
