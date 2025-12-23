import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // ✅ Activer rawBody pour les webhooks
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

  // ✅ RAW body pour les webhooks Clerk (Svix)
  app.use('/webhooks/clerk', bodyParser.raw({ type: 'application/json' }));

  // ✅ RAW body pour les webhooks Stripe
  app.use('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }));

  // ✅ JSON normal pour le reste de l'API
  app.use(bodyParser.json());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  // console.log('🚀 Backend GraphQL running on http://localhost:4000/graphql');
  // console.log(
  //   '🪝 Webhook Clerk endpoint: http://localhost:4000/webhooks/clerk',
  // );
  // console.log(
  //   '🪝 Webhook Stripe endpoint: http://localhost:4000/webhooks/stripe',
  // );
}
bootstrap();
