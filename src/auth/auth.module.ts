import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GoogleService } from './google/google.service';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    ConfigService,
    GoogleService,
  ],
})
export class AuthModule {}
