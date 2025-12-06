import { Injectable } from '@nestjs/common';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';

@Injectable()
export class HouseholdService {
  create(createHouseholdDto: CreateHouseholdDto) {
    return 'This action adds a new household';
  }

  findAll() {
    return `This action returns all household`;
  }

  findOne(id: number) {
    return `This action returns a #${id} household`;
  }

  update(id: number, updateHouseholdDto: UpdateHouseholdDto) {
    return `This action updates a #${id} household`;
  }

  remove(id: number) {
    return `This action removes a #${id} household`;
  }
}
