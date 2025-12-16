import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './users/dto/create-user.dto';
import { GoogleService } from './google/google.service';
import { GoogleAuthClientDto } from './dto/google-auth-client.dto';
import { User } from '@app/common';
import generator from 'generate-password-ts';
import { generateUsername } from 'unique-username-generator';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly googleService: GoogleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.generateAndSendTokenRespone(user, res);
  }

  async logout(res: Response) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      secure: true,
    });
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async googleAuth(): Promise<{ url: string }> {
    return this.googleService.getOAuth2ClientUrl();
  }

  async getAuthClientData(code: string): Promise<GoogleAuthClientDto> {
    return this.googleService.getAuthClientData(code);
  }

  async authenticateGoogleUser(
    googleAuthClientDto: GoogleAuthClientDto,
    res: Response,
  ) {
    const { email, name } = googleAuthClientDto;
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      try {
        user = await this.usersService.create({
          email,
          name,
          userName: email.split('@')[0],
          password: generator.generate({ length: 15 }),
        });
      } catch (error) {
        if (error.message.includes('duplicate key value')) {
          user = await this.usersService.create({
            email,
            name,
            userName: generateUsername('', 3),
            password: generator.generate({ length: 15 }),
          });
        }
        throw error;
      }
    }
    await this.generateAndSendTokenRespone(user, res);
    return { url: this.configService.get<string>('FRONTEND_URL') };
  }

  private async generateAndSendTokenRespone(user: User, res: Response) {
    const payload = {
      email: user.email,
      name: user.name,
      userName: user.userName,
      id: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRES_IN'),
    );

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    res.cookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      expires,
    });
  }
}
