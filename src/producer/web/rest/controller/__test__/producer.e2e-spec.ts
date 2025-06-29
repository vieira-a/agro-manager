import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../../app.module';
import { startPostgresContainer } from '../../../../../../test/utils/postgres-container';
import { DataSource } from 'typeorm';
import { cleanDatabase } from '../../../../../../test/utils/clean-database';
import * as cookieParser from 'cookie-parser';
import { CreateProducerRequest } from '../../dto/request';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let container;
  let dataSource: DataSource;
  let producerId: string;

  const validPayload: CreateProducerRequest = {
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

  beforeAll(async () => {
    const started = await startPostgresContainer();
    container = started.container;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule.forRoot(started.config)],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    app.use(cookieParser());
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.runMigrations();
  });

  beforeEach(async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/producers')
      .send(validPayload)
      .expect(201);

    producerId = res.body.data.id;
  });

  afterEach(async () => {
    await cleanDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  describe('POST /producers', () => {
    it('should create a producer with correct values', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/producers')
        .send(validPayload)
        .expect(201);
      expect(res.body.data.name).toBe('Darth Vader');
    });

    it('should throw to create a producer without required fields', async () => {
      const payload = {};

      const res = await request(app.getHttpServer())
        .post('/api/v1/producers')
        .send(payload)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('document'),
          expect.stringContaining('password'),
          expect.stringContaining('passwordConfirmation'),
          expect.stringContaining('name'),
        ]),
      );
    });

    it('should throw if password and passwordConfirmation not match', async () => {
      const payload = {
        ...validPayload,
        passwordConfirmation: 'P@ssword11',
      };

      const res = await request(app.getHttpServer())
        .post('/api/v1/producers')
        .send(payload)
        .expect(422);

      expect(res.body.message).toContain(
        'Senha e confirmação de senha são diferentes',
      );
    });
  });

  describe('GET /producers', () => {
    it('should return all producers', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/producers')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].name).toBe('Darth Vader');
    });

    it('should return producer by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/producers/${producerId}`)
        .expect(200);

      expect(res.body.data.id).toBe(producerId);
      expect(res.body.data.name).toBe('Darth Vader');
    });

    it('should return 404 if producer id not found', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/producers/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /producers/:id', () => {
    it('should update producer name with auth guard', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent
        .post('/api/v1/auth/login/producers')
        .send({ document: '71663081093', password: 'P@ssword10' })
        .expect(200);

      const patchRes = await agent
        .patch(`/api/v1/producers/${producerId}`)
        .send({ name: 'Anakin Skywalker' })
        .expect(200);

      expect(patchRes.body.message).toBe('Dados atualizados com sucesso');
    });
  });

  describe('DELETE /producers/:id', () => {
    it('should delete a producer with valid id', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/producers/${producerId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/api/v1/producers/${producerId}`)
        .expect(404);
    });
  });
});
