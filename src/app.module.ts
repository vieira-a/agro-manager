import { Module } from '@nestjs/common';
import { ProducerModule } from './producer/producer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './shared/config/config.module';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

@Module({
  imports: [
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
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        autoLogging: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_DB_HOST'),
        port: configService.get<number>('POSTGRES_DB_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
    }),
    ProducerModule,
  ],
})
export class AppModule {}
