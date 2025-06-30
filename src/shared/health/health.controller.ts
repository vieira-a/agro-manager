import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private database: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.database.pingCheck('postgres')]);
  }
}
