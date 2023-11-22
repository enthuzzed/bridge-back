import { NestFactory } from '@nestjs/core';
import { PolygonListenerModule } from './polygon-listener.module';

async function bootstrap() {
  const app = await NestFactory.create(PolygonListenerModule);
  await app.listen(3001);
}
bootstrap();
