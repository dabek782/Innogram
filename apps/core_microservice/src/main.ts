import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config({path:'./.env'})
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: '*' });
    const PORT = process.env.PORT || 3001;
    await app.listen(PORT, '0.0.0.0');
    console.log("works")
  } catch (error) {
    console.error('error', error);
  }
}
bootstrap();