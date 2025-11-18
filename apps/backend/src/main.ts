import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config({path:"../.env"})
@Module({})
class AppModule {}
const uri:string | undefined  = process.env.MONGO_DB_URI
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);
  if (!uri) throw new Error('MONGO_DB_URI is not defined');
  await connect(uri)
}
bootstrap();