import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AbstractCrudService, Transaction, User } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

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

  async findAllByUser(
    user: User,
    startDate?: string,
    endDate?: string,
  ): Promise<Transaction[]> {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }

    const where: any = { householdId };

    if (startDate && endDate) {
      where.date = Between(new Date(startDate), new Date(endDate));
    }

    return this.transactionRepository.find({ where });
  }

  async getAllGroupedByDate(user: User) {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }
    return await this.transactionRepository.find({
      where: { householdId: householdId },
      order: { date: 'ASC' },
    });
  }
}
