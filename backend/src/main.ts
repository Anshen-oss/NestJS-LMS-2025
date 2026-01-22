import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS EN PREMIER (avant tout)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Parser JSON standard pour toutes les routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ✅ GraphQL upload SEULEMENT pour /graphql (PAS pour /api/upload!)
  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFileSize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  );

  // 🔑 Webhooks Stripe
  app.use(
    '/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    (
      req: express.Request & { rawBody?: Buffer },
      res: express.Response,
      next: express.NextFunction,
    ) => {
      req.rawBody = req.body;
      express.json()(req, res, next);
    },
  );

  // 🔑 Webhooks Clerk
  app.use(
    '/webhooks/clerk',
    express.raw({ type: 'application/json' }),
    (
      req: express.Request & { rawBody?: Buffer },
      res: express.Response,
      next: express.NextFunction,
    ) => {
      req.rawBody = req.body;
      express.json()(req, res, next);
    },
  );

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`✅ Server running on http://localhost:${port}`);
}

bootstrap();
