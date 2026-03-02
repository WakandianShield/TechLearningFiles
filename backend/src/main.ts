import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security: Helmet headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://adaptable-unity-production.up.railway.app',
    'http://localhost:3000',
  ].filter((o): o is string => Boolean(o));

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Ensure upload directory exists (persistent volume on Railway)
  const uploadDir = process.env.UPLOAD_DIR || join(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
    console.log(`[UPLOADS] Created upload directory: ${uploadDir}`);
  } else {
    console.log(`[UPLOADS] Upload directory ready: ${uploadDir}`);
  }

  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('TechLearning API')
    .setDescription('Academic Files & Projects Journey Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  console.log(`Starting server on 0.0.0.0:${port}...`);
  console.log(`DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
  console.log(`JWT_SECRET set: ${!!process.env.JWT_SECRET}`);
  await app.listen(port, '0.0.0.0');
  console.log(`[OK] Backend running on port ${port}`);
  console.log(`[DOCS] API Docs: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('[ERROR] Failed to start application:', err);
  process.exit(1);
});
