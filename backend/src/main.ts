import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  //Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cookie parser
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Webhook endpoint accessible publiquement
  app.use('/webhooks/clerk', (req, res, next) => {
    // Pas de middleware d'auth pour les webhooks
    next();
  });

  // ✅ RAW uniquement sur le webhook Clerk (Svix)
  app.use('/webhooks/clerk', bodyParser.raw({ type: 'application/json' }));

  // ✅ JSON normal pour le reste
  app.use(bodyParser.json());

  app.use('/webhooks/clerk', bodyParser.raw({ type: 'application/json' }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log('🚀 Backend GraphQL running on http://localhost:4000/graphql');
}
bootstrap();
