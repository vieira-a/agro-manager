import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/exception/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Agro Manager')
    .setDescription('Sistema para gereciamento de propriedades rurais')
    .setVersion('1.0')
    .addTag('Endpoints')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, documentFactory, {
    swaggerOptions: {
      supportedSubmitMethods: [],
    },
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api/v1');

  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
