import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  const prot = process.env.NODE_ENV === 'dev' ? 4001 : 3001;
  await app.listen(prot);
}
bootstrap();
