import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // logger
  app.useLogger(
    configService.get<string>('app.env') === 'prod'
      ? ['error', 'warn', 'log']
      : ['debug'],
  );

  // swagger
  const swaggerConfig = new DocumentBuilder().setTitle('LoaStat API').build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
