import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';

@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createHouseholdDto: CreateHouseholdDto,
    @CurrentUser() user: User,
  ) {
    return await this.householdService.create(createHouseholdDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.householdService.findAll();
  }
}
