import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../../app.module';
import { startPostgresContainer } from '../../../../../../test/utils/postgres-container';
import * as cookieParser from 'cookie-parser';
import { CreateProducerRequest } from '../../../../../producer/web/rest/dto/request';
import { cleanDatabase } from '../../../../../../test/utils/clean-database';
import { DataSource } from 'typeorm';
import { ProducerRole } from '../../../../../producer/domain/enum/producer-role.enum';

describe('AuthenticationController (e2e)', () => {
  let app: INestApplication;
  let container;
  let dataSource: DataSource;
  let producerId: string;
  let refreshToken: string | undefined;

  const validPayload: CreateProducerRequest = {
    document: '71663081093',
    name: 'Darth Vader',
    role: ProducerRole.PRODUCER_USER,
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.runMigrations();

    const res = await request(app.getHttpServer())
      .post('/api/v1/producers')
      .send(validPayload)
      .expect(201);
    producerId = res.body.data.id;

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login/producers')
      .send({
        document: validPayload.document,
        password: validPayload.password,
      })
      .expect(200);

    const cookies = loginRes.headers['set-cookie'];
    const cookiesArray: string[] = Array.isArray(cookies)
      ? cookies
      : typeof cookies === 'string'
        ? [cookies]
        : [];
    const refreshCookie = cookiesArray.find((cookie) =>
      cookie.startsWith('refresh_token='),
    );
    refreshToken = refreshCookie?.split(';')[0].split('=')[1];
  });

  afterAll(async () => {
    await cleanDatabase(dataSource);
    await app.close();
    await container.stop();
  });

  describe('POST /auth/login/producers', () => {
    it('should producer login successfully', async () => {
      const { document } = validPayload;
      const payload = { document, password: 'P@ssword10' };

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login/producers')
        .send(payload)
        .expect(200);

      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.body.message).toBe('Login efetuado com sucesso.');
    });

    it('should return 401 for wrong password', async () => {
      const payload = {
        document: validPayload.document,
        password: 'WrongPassword11!',
      };

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login/producers')
        .send(payload)
        .expect(401);

      expect(res.body.exception.message).toBe('Senha incorreta.');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh tokens successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);

      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.body.message).toBe('Token renovado com sucesso.');
    });

    it('should return 401 if refresh_token cookie is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .expect(401);

      expect(res.body.exception.message).toBe('Refresh token não informado.');
    });

    it('should return 403 if refresh_token cookie is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', ['refresh_token=invalidtoken'])
        .expect(403);

      expect(res.body.exception.message).toBe('Token inválido ou expirado.');
    });
  });
});
