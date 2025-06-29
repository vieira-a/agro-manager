import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSourceOptions } from 'typeorm';

export async function startPostgresContainer() {
  const container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_pass')
    .start();

  const config: DataSourceOptions = {
    type: 'postgres',
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    entities: [__dirname + '/../../src/**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../../database/migrations/*.{ts,js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
    dropSchema: false,
    logging: false,
  };

  return { container, config };
}
