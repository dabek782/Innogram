import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import dotenv from "dotenv";
import { ConfigModule } from "@nestjs/config";
import connectDB from "./auth_microservice/db_config";

ConfigModule.forRoot()

dotenv.config({path:"../.env"})
@Module({})
class AppModule {}
const uri:string | undefined  = process.env.MONGO_DB_URI
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);
  const connection = connectDB(uri!)

}
bootstrap();