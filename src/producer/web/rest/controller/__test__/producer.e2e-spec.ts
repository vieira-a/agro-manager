import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../../app.module';
import { resetDatabase } from '../../../../../../database/helper/reset-database';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  beforeEach(async () => {
    await resetDatabase(app);
  });

  afterEach(async () => {
    await resetDatabase(app);
  });

  afterAll(async () => {
    await app.close();
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

    return request(app.getHttpServer())
      .post('/api/v1/producers')
      .send(payload)
      .expect(201);
  });
});
