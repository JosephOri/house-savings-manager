import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { CreateUserDto } from './users/dto/create-user.dto';
import { JwtAuthGuard, LocalAuthGuard } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
  }

  @Get('google-auth')
  @Redirect()
  async googleAuth(): Promise<{ url: string }> {
    return this.authService.googleAuth();
  }

  @Get('google-callback')
  @Redirect()
  async googleAuthCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ url: string }> {
    const googleAuthClientDto = await this.authService.getAuthClientData(code);
    return await this.authService.authenticateGoogleUser(
      googleAuthClientDto,
      res,
    );
  }
}
