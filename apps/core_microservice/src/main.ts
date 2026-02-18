import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { GlobalFiler } from './common/execption_filter';
import { setupSwagger } from './swagger/swagger_setUp';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
dotenv.config({ path: './.env' });
async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      })
    );
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
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: `${process.env.PREFIX}/v`,
    });
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });
    setupSwagger(app);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT')!;
    await app.listen(port);
    console.log('works');
  } catch (error) {
    console.error('error', error);
  }
}
bootstrap();
