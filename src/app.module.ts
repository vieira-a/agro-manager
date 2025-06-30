import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityModule } from './identity/identity.module';
import { ProducerModule } from './producer/producer.module';
import { typeOrmConfig } from '../database/typeorm.config';
import { DataSourceOptions } from 'typeorm';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './shared/exception/global-exception.filter';
import { HealthModule } from './shared/health/health.module';

@Module({})
export class AppModule {
  static forRoot(overrideDbConfig?: DataSourceOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            `.env.${process.env.NODE_ENV}.local`,
            `.env.${process.env.NODE_ENV}`,
            '.env',
          ],
        }),
        JwtModule.register({
          secret: process.env.JWT_TOKEN_SECRET,
          signOptions: { expiresIn: '15m' },
        }),
        LoggerModule.forRoot({
          pinoHttp: {
            transport:
              process.env.NODE_ENV !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      translateTime: 'SYS:standard',
                      ignore: 'pid,hostname',
                    },
                  }
                : undefined,
          },
        }),
        HealthModule,
        TypeOrmModule.forRoot(overrideDbConfig || typeOrmConfig),
        IdentityModule,
        ProducerModule,
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
      ],
    };
  }
}
