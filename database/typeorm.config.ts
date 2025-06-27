import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

const envFile = `.env.${process.env.NODE_ENV || 'development'}.local`;
config({ path: envFile });

const isProd = process.env.NODE_ENV === 'production';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: parseInt(process.env.POSTGRES_DB_PORT ?? '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [
    isProd
      ? path.join(__dirname, '**', '*.entity.js')
      : path.join(__dirname, '..', 'src', '**', '*.entity.ts'),
  ],
  migrations: [
    isProd
      ? path.join(__dirname, 'migrations', '*.js')
      : path.join(__dirname, '..', 'migrations', '*.ts'),
  ],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: !isProd,
};
