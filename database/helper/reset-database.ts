import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export async function resetDatabase(app: INestApplication) {
  const dataSource = app.get(DataSource);

  const db = await dataSource.query('SELECT current_database()');
  const schema = await dataSource.query('SELECT current_schema()');
  console.log('Banco atual:', db[0].current_database);
  console.log('Schema atual:', schema[0].current_schema);

  const tables = await dataSource.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename != 'migrations'
  `);

  const tableNames = tables.map((t: any) => `"${t.tablename}"`);

  if (tableNames.length > 0) {
    await dataSource.query(
      `TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE;`,
    );
  }

  for (const table of tableNames) {
    const countResult = await dataSource.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`Registros em ${table}:`, countResult[0].count);
  }
}
