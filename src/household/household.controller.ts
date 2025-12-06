import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';

@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  create(@Body() createHouseholdDto: CreateHouseholdDto) {
    return this.householdService.create(createHouseholdDto);
  }

  @Get()
  findAll() {
    return this.householdService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.householdService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHouseholdDto: UpdateHouseholdDto) {
    return this.householdService.update(+id, updateHouseholdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.householdService.remove(+id);
  }
}
