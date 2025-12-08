import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./databases/database.module";
import { UsersModule } from "./modules/users/users.module";
import { AccountModule } from "./modules/accounts/account.module";
import { authMiddleware } from "./common/auth_middleware";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports:[
    DatabaseModule,
    UsersModule,
    AccountModule,
    AuthModule
  ],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(authMiddleware)
    .forRoutes('*')
  }
}