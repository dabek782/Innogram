import { Module } from '@nestjs/common';
import { DatabaseModule } from './databases/database.module';
import { UsersModule } from './modules/users/users.module';
import { AccountModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from './common/rmq/rmq.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comments/comment.module';
import { AssetController } from './modules/asset/asset.controller';
import { AssetService } from './modules/asset/asset.service';
import { AssetModule } from './modules/asset/asset.module';
import { PostAssetService } from './modules/post/post_asset/post_asset.service';
import { PostAssetModule } from './modules/post/post_asset/post_asset.module';
import { PostAssetController } from './modules/post/post_asset/post_asset.controller';
import { ProfileController } from './modules/profile/profile.controller';
import { ProfileService } from './modules/profile/profile.service';
import { ProfileModule } from './modules/profile/profile.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AccountModule,
    AuthModule,
    PostModule,
    CommentModule,
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AssetModule,
    PostAssetModule,
    ProfileModule,
    ChatModule,
    RmqModule,
  ],
  providers: [AssetService, PostAssetService, ProfileService],
  controllers: [AssetController, PostAssetController, ProfileController],
})
export class AppModule {}
