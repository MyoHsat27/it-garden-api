import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { StandardExceptionFilter, StandardResponseInterceptor } from './common';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.set('trust proxy', true);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/static/',
  });

  const allowedOrigins = configService.get<string>('CORS_ALLOWED_SITES');
  const corsOptions: CorsOptions = {
    origin: allowedOrigins
      ? allowedOrigins.split(',').map((item) => item.trim())
      : [],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  };

  app.setGlobalPrefix('api/v1');
  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
  app.useGlobalInterceptors(new StandardResponseInterceptor());
  app.useGlobalFilters(new StandardExceptionFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('IT Garden API')
    .setDescription('IT Garden API Documentation')
    .setVersion('1.0')
    .setContact(
      'IT Garden',
      'https://www.itgarden.org/',
      'itgarden.edu@gmail.com',
    )
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
