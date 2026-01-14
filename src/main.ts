import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger("Root");
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const contextPath = process.env.CONTEXT_PATH || '/api/v1';
  app.setGlobalPrefix(contextPath);
  await app.listen(PORT);

  logger.verbose(process.env.NODE_ENV === 'production' ? "You are running in PRODUCTION at port" : "You are running DEVELOPMENT!")
  logger.verbose(`Application is running on: http://localhost:${PORT}${contextPath}`);
}
bootstrap();
