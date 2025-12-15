import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './databases/database.module';
import { UsersModule } from './modules/users/users.module';
import { AccountModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AccountModule,
    AuthModule,
    ConfigModule.forRoot({
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
