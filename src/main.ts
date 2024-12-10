import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
dotenv.config(); // Muat variabel dari file .env

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Validasi request secara global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus field yang tidak didefinisikan dalam DTO
      forbidNonWhitelisted: true, // Lempar error jika field tidak dikenal
      transform: true, // Transform request payload menjadi tipe DTO
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
