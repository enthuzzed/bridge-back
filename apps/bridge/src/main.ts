import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let logger: Logger;

const globalPrefix = 'api/v1';

async function bootstrap() {
  logger = new Logger('AdminPanel');
  try {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(new ValidationPipe());

    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
      credentials: true,
    });

    const options = new DocumentBuilder()
      .setTitle('dfinity-polygon bridge')
      .setDescription('Provides REST API')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

    await app.listen(3000);
    logger.debug(`Application is running on ${await app.getUrl()}`);
  } catch (e) {
    logger.error(e);
  }
}
bootstrap();
