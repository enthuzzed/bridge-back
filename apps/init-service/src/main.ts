import { NestFactory } from '@nestjs/core';
import { InitServiceModule } from './init-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InitServiceModule);
  await app.init();
  process.exit();
}
bootstrap();
