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
    private readonly logger: Logger,
  ) {}
  async create(createHouseholdDto: CreateHouseholdDto, user: User) {
    try {
      const household = this.householdRepository.create({
        ...createHouseholdDto,
        adminId: user.id,
        participants: [user],
      });
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
    const household = await this.householdRepository.findOneBy({
      id: createFinancialOrderDto.householdId,
    });
    if (!household) {
      throw new BadRequestException('Household with this id not found');
    }
    const financialOrder = this.financialOrderRepository.create({
      ...createFinancialOrderDto,
      name: user.name,
      date: new Date(),
      household: household,
    });
    this.logger.log(
      'Financial order added successfully for household:',
      household,
    );
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
