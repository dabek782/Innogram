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
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RmqService } from './common/rmq/rmq.service';
import * as amqp from 'amqplib';

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
    const connection = amqp.connect(process.env.RABBITMQ_URL || '');
    const createChannel = (await connection).createChannel({
      json: true,
      setUp: channel => {
        return channel.assertExchange(process.env.EVENTS_EXCHANGE!, 'topic', {
          durable: true,
        });
      },
    });
    await createChannel.waitForConnect();
    console.log('Connected to RabbitMQ');

    const rmqService = app.get<RmqService>(RmqService);
    console.log('rmqService', rmqService);
    app.connectMicroservice(rmqService.getOptions('auth'));
    await app.startAllMicroservices();
    app.useWebSocketAdapter(new IoAdapter(app));
    setupSwagger(app);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT')!;
    await app.listen(port);
    console.log('works');
  } catch (error) {
    console.error('error', error);
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
