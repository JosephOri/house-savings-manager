import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HouseholdService } from './household.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';

@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  async create(@Body() createHouseholdDto: CreateHouseholdDto) {
    return await this.householdService.create(createHouseholdDto);
  }

  @Get()
  async findAll() {
    return await this.householdService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.householdService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHouseholdDto: UpdateHouseholdDto,
  ) {
    return await this.householdService.update(id, updateHouseholdDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.householdService.remove(id);
  }
}
