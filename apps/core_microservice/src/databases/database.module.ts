import { Module , Global } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.config";

@Global()
@Module({
  providers:[PrismaService],
  exports : [PrismaService],
})

export class DatabaseModule {}