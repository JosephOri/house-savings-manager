import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseholdModule } from './household/household.module';
import { FinancialOrderModule } from './financial-order/financial-order.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.number().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_REDIRECT_URI: Joi.string().required(),
        BROKER_URI: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    LoggerModule,
    AuthModule,
    UsersModule,
    HouseholdModule,
    FinancialOrderModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
