import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../../app.module';
import { startPostgresContainer } from '../../../../../../test/utils/postgres-container';
import { DataSource } from 'typeorm';
import { cleanDatabase } from '../../../../../../test/utils/clean-database';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let container;
  let dataSource: DataSource;

  beforeAll(async () => {
    const started = await startPostgresContainer();
    container = started.container;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule.forRoot(started.config)],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.runMigrations();
  });

  afterEach(async () => {
    await cleanDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  it('/producers (POST) - should create a producer with correct values', async () => {
    const payload = {
      document: '71663081093',
      name: 'Darth Vader',
      password: 'P@ssword10',
      passwordConfirmation: 'P@ssword10',
      farm: {
        name: 'Fazenda Tattoine',
        city: 'Tatooine',
        state: 'TT',
        totalArea: 150.5,
        agriculturalArea: 75.0,
        vegetationArea: 52.5,
        harvest: {
          description: 'Safra Inverno',
          year: 2024,
          crop: {
            name: 'Arroz',
          },
        },
      },
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/producers')
      .send(payload)
      .expect(201);
    expect(res.body.data.name).toBe('Darth Vader');
  });

  it('/producers (GET) - should return all producers', async () => {
    const payload = {
      document: '71663081093',
      name: 'Darth Vader',
      password: 'P@ssword10',
      passwordConfirmation: 'P@ssword10',
      farm: {
        name: 'Fazenda Tattoine',
        city: 'Tatooine',
        state: 'TT',
        totalArea: 150.5,
        agriculturalArea: 75.0,
        vegetationArea: 52.5,
        harvest: {
          description: 'Safra Inverno',
          year: 2024,
          crop: {
            name: 'Arroz',
          },
        },
      },
    };

    await request(app.getHttpServer())
      .post('/api/v1/producers')
      .send(payload)
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/v1/producers')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Darth Vader');
  });
});
