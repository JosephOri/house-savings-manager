import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFinancialOrderDto } from './dto/create-financial-order.dto';
import { AbstractCrudService, FinancialOrder, User } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FinancialOrderService extends AbstractCrudService<FinancialOrder> {
  constructor(
    @InjectRepository(FinancialOrder)
    private readonly financialOrderRepository: Repository<FinancialOrder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(financialOrderRepository);
  }

  async createOrder(
    createFinancialOrderDto: CreateFinancialOrderDto,
    user: User,
  ) {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }
    return super.create({
      ...createFinancialOrderDto,
      householdId,
      name: user.name,
      date: new Date(),
    });
  }
}
