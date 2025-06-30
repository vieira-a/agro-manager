import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { HealthModule } from '../health.module';
import { HealthController } from '../health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let controller: HealthController;
  let service: HealthCheckService;

  const mockTypeOrmHealthIndicator = {
    pingCheck: jest.fn(() => Promise.resolve({ postgres: { status: 'up' } })),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue(mockTypeOrmHealthIndicator)
      .compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get(HealthController);
    service = moduleFixture.get(HealthCheckService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) should return status "ok"', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();

    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('status', 'ok');
        expect(body.details).toHaveProperty('postgres');
        expect(body.details.postgres.status).toBe('up');
      });
  });
});
