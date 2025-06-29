import { DataSource } from 'typeorm';

export async function cleanDatabase(dataSource: DataSource) {
  const tables = await dataSource.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename != 'migrations'
  `);

  const tableNames = tables.map((table) => `"${table.tablename}"`);

  if (tableNames.length > 0) {
    await dataSource.query(
      `TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE;`,
    );
  }
}
