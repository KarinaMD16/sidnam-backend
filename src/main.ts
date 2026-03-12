import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.use(cookieParser());


  app.enableCors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman/curl

    const allowed = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      'https://sidnam.org',
      'https://www.sidnam.org',
      'https://hogarsanblas.com',
      'https://www.hogarsanblas.com',
      'https://api.sidnam.org',
    ];

    const ok = allowed.some((o) => (o instanceof RegExp ? o.test(origin) : o === origin));
    return ok ? callback(null, true) : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API SIDNAM')
    .setDescription('Documentación de la API del sistema de voluntariado')
    .setVersion('1.0')
    .addServer('https://api.sidnam.org')

    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
