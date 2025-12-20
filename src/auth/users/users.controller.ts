import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { type AddUserToHouseholdDto } from '@repo/shared';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async me(@CurrentUser() user: User) {
    if (!user) return null;
    return this.usersService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-to-household')
  async addUserToHousehold(
    @Body() addUserToHouseholdDto: AddUserToHouseholdDto,
  ) {
    return await this.usersService.addUserToHousehold(addUserToHouseholdDto);
  }
}
