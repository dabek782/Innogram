import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common';
import { globalFiler } from './common/execption_filter';
import {DocumentBuilder , SwaggerModule} from '@nestjs/swagger'
dotenv.config({path:'./.env'})
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(helmet())
    app.enableCors({ 
      origin: '*',
      credentials:true,
      methods:'GET,POST,DELETE,PUT,PATCH' 
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform:true,
        whitelist:true,
        forbidNonWhitelisted:true,
        transformOptions:{
          enableImplicitConversion:true
        }
      })
    )
    app.useGlobalFilters(new globalFiler())
    
    const config = new DocumentBuilder()
      .setTitle("innogram api docs")
      .setDescription("Documentaion about requests in innogram")
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app ,config)
    SwaggerModule.setup('api' , app , document)
    const PORT = process.env.PORT || 3001;
    await app.listen(PORT, '0.0.0.0');
    console.log("works")
  } catch (error) {
    console.error('error', error);
  }
}
bootstrap();