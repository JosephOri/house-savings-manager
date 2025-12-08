import { BadRequestException, Injectable } from '@nestjs/common';
import { User, FinancialOrder } from '@app/common';
import { Household } from '../../libs/common/src/entities/household.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { CreateFinancialOrderDto } from './dto/create-financial-order.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class HouseholdService {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
    @InjectRepository(FinancialOrder)
    private readonly financialOrderRepository: Repository<FinancialOrder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}
  async create(createHouseholdDto: CreateHouseholdDto, user: User) {
    try {
      const household = this.householdRepository.create({
        ...createHouseholdDto,
        adminId: user.id,
      });
      await this.userRepository.update(user.id, { householdId: household.id });
      return await this.householdRepository.save(household);
    } catch (error) {
      if (error.message.includes('duplicate key value')) {
        throw new BadRequestException(
          'Household with this admin already exists, an admin can have one household',
        );
      }
      throw error;
    }
  }

  async addFinancialOrder(
    createFinancialOrderDto: CreateFinancialOrderDto,
    user: User,
  ) {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }
    const financialOrder = this.financialOrderRepository.create({
      ...createFinancialOrderDto,
      householdId,
    });
    return await this.financialOrderRepository.save(financialOrder);
  }

  async findAll() {
    const households = await this.householdRepository.find({
      relations: {
        participants: true,
        financialOrders: true,
      },
    });
    return households;
  }
}
