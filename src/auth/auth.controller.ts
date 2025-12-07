import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(loginDto, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Get('all-users')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async me(@CurrentUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
