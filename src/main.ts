import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dot Challenge Intern API')
    .setDescription('API documentation for Dot Challenge Intern backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearerAuth',
    )
    .addSecurityRequirements('bearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      content: document,
      persistAuth: true,
      authentication: {
        preferredSecurityScheme: 'bearerAuth',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
