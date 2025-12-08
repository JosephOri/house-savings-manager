import { BadRequestException, Injectable } from '@nestjs/common';
import { User, Household } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class HouseholdService {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
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
