import { Module } from '@nestjs/common';
import { DatabaseModule } from './databases/database.module';
import { UsersModule } from './modules/users/users.module';
import { AccountModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/auth_guard';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AccountModule,
    AuthModule,
    PostModule,
    ConfigModule.forRoot({
      expandVariables: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
