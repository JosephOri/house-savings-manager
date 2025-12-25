import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AbstractCrudService, Transaction, User } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService extends AbstractCrudService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(transactionRepository);
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ) {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }
    return super.create({
      ...createTransactionDto,
      householdId,
      name: user.name,
      date: createTransactionDto.date || Date.now(),
    });
  }

  async findAllByUser(user: User): Promise<Transaction[]> {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }
    return this.transactionRepository.find({ where: { householdId } });
  }

  async getAllGroupedByDate(user: User) {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }
    const transactions = await this.transactionRepository.find({
      where: { householdId: householdId },
      order: { date: 'DESC' },
    });
    return this.groupBy(transactions, (transaction) => {
      return new Date(transaction.date).toISOString().split('T')[0];
    });
  }

  private groupBy = <T>(
    array: T[],
    keySelector: (item: T) => string | number,
  ): Record<string, T[]> => {
    return array.reduce(
      (groups, item) => {
        const key = keySelector(item);
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      },
      {} as Record<string, T[]>,
    );
  };
}
