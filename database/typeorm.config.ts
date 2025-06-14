import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

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
      ? __dirname + '/../dist/src/**/*.entity.js'
      : __dirname + '/../src/**/*.entity.ts',
  ],
  migrations: [
    isProd
      ? __dirname + 'dist/database/migrations/*.js'
      : __dirname + '/migrations/*.ts',
  ],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
};
