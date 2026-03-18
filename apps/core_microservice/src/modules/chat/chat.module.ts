import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatParticipantController } from './chat-particapant/chat-participant.controller';
import { ChatParticipantService } from './chat-particapant/chat-participant.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { PrismaService } from 'src/databases/prisma.service';

@Module({
  controllers: [ChatController, ChatParticipantController, MessageController],
  providers: [
    ChatService,
    ChatGateway,
    ChatParticipantService,
    MessageService,
    PrismaService,
  ],
})
export class ChatModule {}
