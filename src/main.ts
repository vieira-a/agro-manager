import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/exception/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
