import { Injectable } from '@nestjs/common';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { AbstractCrudService } from '@app/common';
import { Household } from '../../libs/common/src/entities/household.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HouseholdService extends AbstractCrudService<Household> {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
  ) {
    super(householdRepository);
  }
}
