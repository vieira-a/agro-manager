import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../../app.module';
import { startPostgresContainer } from '../../../../../../test/utils/postgres-container';
import { DataSource } from 'typeorm';
import { cleanDatabase } from '../../../../../../test/utils/clean-database';
import * as cookieParser from 'cookie-parser';
import { CreateProducerRequest } from '../../dto/request';
import * as jwt from 'jsonwebtoken';

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

    // Criar o produtor só uma vez
    const res = await request(app.getHttpServer())
      .post('/api/v1/producers')
      .send(validPayload)
      .expect(201);

    producerId = res.body.data.id;
  });

  afterAll(async () => {
    // Limpeza final do banco após todos os testes
    await cleanDatabase(dataSource);
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

    it('should throw if password is weak', async () => {
      const payload = {
        ...validPayload,
        password: '123456',
        passwordConfirmation: '123456',
      };

      const res = await request(app.getHttpServer())
        .post('/api/v1/producers')
        .send(payload)
        .expect(400);

      expect(res.body.message).toContain(
        'A senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e caracteres especiais',
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

    it('should return 401 if access_token cookie is empty', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/producers/${producerId}`)
        .set('Cookie', 'access_token=')
        .send({ name: 'Anakin Skywalker' })
        .expect(401);

      expect(res.body.message).toContain('Unauthorized');
    });

    it('should return 401 if access_token cookie is missing', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/producers/${producerId}`)
        .send({ name: 'New name' })
        .expect(401);

      expect(res.body.message).toContain('Unauthorized');
    });

    it('should return 401 if access_token is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/producers/${producerId}`)
        .set('Cookie', 'access_token=invalid.token.value')
        .send({ name: 'Nome Inválido' })
        .expect(401);

      expect(res.body.message).toContain('Unauthorized');
    });

    it('should return 403 if token payload type is invalid', async () => {
      const invalidPayload = {
        sub: producerId,
        document: '71663081093',
        type: 'refresh',
      };

      const secret = process.env.JWT_TOKEN_SECRET!;
      const invalidToken = jwt.sign(invalidPayload, secret, {
        expiresIn: '15m',
      });

      const cookieHeader = `access_token=${invalidToken}`;

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/producers/${producerId}`)
        .set('Cookie', cookieHeader)
        .send({ name: 'Anakin Skywalker' })
        .expect(403);

      expect(res.body.message).toContain('Token inválido para acesso.');
    });

    it('should return 400 if trying to update with invalid name', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent
        .post('/api/v1/auth/login/producers')
        .send({ document: '71663081093', password: 'P@ssword10' })
        .expect(200);

      const patchRes = await agent
        .patch(`/api/v1/producers/${producerId}`)
        .send({ name: '' })
        .expect(422);

      expect(patchRes.body.message).toContain(
        'Parâmetro do Produtor inválido ou não informado: Nome',
      );
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

    it('should return 404 when deleting a non-existent producer', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .delete(`/api/v1/producers/${nonExistentId}`)
        .expect(404);
    });
  });
});
