import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
 
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(3000);
}
bootstrap();