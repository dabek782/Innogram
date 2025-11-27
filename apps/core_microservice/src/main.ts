import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin:'http://localhost:3000',
    methods:'GET,PUT,PATCH,POST,DELETE',
    credentials:true
  })
  await app.listen(3001)
  console.log("core microservice is running")
}
bootstap()