import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.use(cookieParser());


  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://hogar-san-blas-informativa.vercel.app',
      'https://sidnam-administrativa.vercel.app',
        'http://187.124.88.238:8080',
    ],
    credentials: true, 
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API SIDNAM')
    .setDescription('Documentación de la API del sistema de voluntariado')
    .setVersion('1.0')
    .addServer('https://sidnam.org/api')

    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
