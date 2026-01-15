import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { graphqlUploadExpress } from 'graphql-upload-ts'; // 🆕 IMPORT
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🆕 MIDDLEWARE POUR UPLOADS (AVANT les autres middlewares)
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  );

  // 🔑 CLÉE: Middleware qui injecte rawBody pour les webhooks
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

  // JSON normal pour le reste
  app.use(express.json());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

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
