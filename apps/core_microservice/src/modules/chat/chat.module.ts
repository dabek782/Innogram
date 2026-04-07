import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatParticipantController } from './chat-particapant/chat-participant.controller';
import { ChatParticipantService } from './chat-particapant/chat-participant.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { PrismaService } from '../../databases/prisma.service';
import { MessageAssetModule } from './message_asset/message_asset.module';
import { MessageAssetController } from './message_asset/message_asset.controller';
import { MessageAssetService } from './message_asset/message_asset.service';

@Module({
  controllers: [
    ChatController,
    ChatParticipantController,
    MessageController,
    MessageAssetController,
  ],
  providers: [
    ChatService,
    ChatGateway,
    ChatParticipantService,
    MessageService,
    PrismaService,
    MessageAssetService,
  ],
  imports: [MessageAssetModule],
})
export class ChatModule {}
