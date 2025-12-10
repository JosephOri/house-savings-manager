import { Controller, Post, UseGuards, Get } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';

@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: User) {
    return await this.householdService.create(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.householdService.findAll();
  }
}
