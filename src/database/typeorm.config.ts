import { config } from 'dotenv';
import { existsSync } from 'fs';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';

const envPath = `.env.${process.env.NODE_ENV}`;
const localEnvPath = `${envPath}.local`;

config({ path: existsSync(localEnvPath) ? localEnvPath : envPath });

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isCompiled = __filename.includes('dist');

const migrationsPath = path.resolve(__dirname, 'migrations');

console.log('Ambiente: ', process.env.NODE_ENV);
console.log(path.join(__dirname));

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: parseInt(process.env.POSTGRES_DB_PORT ?? '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [
    isProd || isCompiled
      ? path.join(__dirname, '..', '**', '*.entity.js')
      : path.join(__dirname, '..', 'src', '**', '*.entity.ts'),
  ],
  migrations: [
    isProd
      ? path.join(migrationsPath, '*.js')
      : path.join(migrationsPath, '*.ts'),
  ],
  migrationsTableName: 'migrations',
  synchronize: isTest,
  dropSchema: false,
  logging: !isProd,
};
