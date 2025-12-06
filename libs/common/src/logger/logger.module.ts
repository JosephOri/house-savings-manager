import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'dd-mm-yyyy HH:MM:ss',
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
