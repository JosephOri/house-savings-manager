import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { AddUserToHouseholdDto } from './dto/add-user-to-household.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Return current user.' })
  @Get('me')
  async me(@CurrentUser() user: User) {
    if (!user) return null;
    return this.usersService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add user to household' })
  @ApiResponse({ status: 201, description: 'User added to household.' })
  @Post('add-to-household')
  async addUserToHousehold(
    @Body() addUserToHouseholdDto: AddUserToHouseholdDto,
  ) {
    return await this.usersService.addUserToHousehold(addUserToHouseholdDto);
  }
}
