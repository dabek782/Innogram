import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { GlobalFiler } from './common/execption_filter';
import { setupSwagger } from './swagger/swagger_setUp';
import { ConfigService } from '@nestjs/config';
dotenv.config({ path: './.env' });
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.enableCors({
      origin: '*',
      credentials: true,
      methods: 'GET,POST,DELETE,PUT,PATCH',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );
    app.useGlobalFilters(new GlobalFiler());
    const configService = app.get(ConfigService);
    const prefix = configService.get<string>('APP_PREFIX');
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: `${prefix}/v`,
    });

    setupSwagger(app);

    console.log('works');
  } catch (error) {
    console.error('error', error);
  }
}
bootstrap();
