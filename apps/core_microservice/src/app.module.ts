import { Module } from '@nestjs/common';
import { DatabaseModule } from './databases/database.module';
import { UsersModule } from './modules/users/users.module';
import { AccountModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/auth_guard';
import { PostModule } from './modules/post/post.module';
import { AssetController } from './modules/asset/asset.controller';
import { AssetService } from './modules/asset/asset.service';
import { AssetModule } from './modules/asset/asset.module';
import { PostAssetService } from './modules/post/post_asset/post_asset.service';
import { PostAssetModule } from './modules/post/post_asset/post_asset.module';
import { PostAssetController } from './modules/post/post_asset/post_asset.controller';
import { ProfileController } from './modules/profile/profile.controller';
import { ProfileService } from './modules/profile/profile.service';
import { ProfileModule } from './modules/profile/profile.module';
import { ProfileModule } from './profile/profile.module';

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
    AssetModule,
    PostAssetModule,
    ProfileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AssetService,
    PostAssetService,
    ProfileService,
  ],
  controllers: [AssetController, PostAssetController, ProfileController],
})
export class AppModule {}
