import { PrismaPg } from "@prisma/adapter-pg";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy , OnModuleInit{
  constructor(){
    const url = process.env.DATABASE_URL
    super({
      adapter:new PrismaPg({
        connectionString : url,
       
      })
    })
  }
  async onModuleInit() {
    await this.$connect()
  }
  async onModuleDestroy() {
    await this.$disconnect()
  }
}