import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger("Root");
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const contextPath = process.env.CONTEXT_PATH || '/api/v1';

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(contextPath);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  await app.listen(PORT);

  logger.verbose(process.env.NODE_ENV === 'production' ? "You are running in PRODUCTION at port" : "You are running DEVELOPMENT!")
  logger.verbose(`Application is running on: http://localhost:${PORT}${contextPath}`);
}
bootstrap();
