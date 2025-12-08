import { BadRequestException, Injectable } from '@nestjs/common';
import { User, Household, AbstractCrudService } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';

@Injectable()
export class HouseholdService extends AbstractCrudService<Household> {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {
    super(householdRepository);
  }
  async create(user: User) {
    try {
      const savedHousehold = await super.create({ adminId: user.id });
      await this.userRepository.update(user.id, {
        householdId: savedHousehold.id,
      });
      return savedHousehold;
    } catch (error) {
      this.logger.error(error);
      if (error.message.includes('duplicate key value')) {
        throw new BadRequestException(
          'Household with this admin already exists, an admin can have one household',
        );
      }
      throw error;
    }
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
