import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from '@app/common';
import { Income } from './entities/income.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IncomeService extends AbstractCrudService<Income> {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {
    super(incomeRepository);
  }
}
