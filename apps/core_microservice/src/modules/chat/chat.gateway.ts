import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatType } from '@prisma/client';
import { ChatRole } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatParticipantService } from './chat-particapant/chat-participant.service';
import { MessageService } from './message/message.service';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from 'src/types/custom-jwt';

type createChat = {
  name: string;
  description?: string;
  type: ChatType;
};
type ChatParticipant = {
  profileId: string;
  chatId: string;
  role: ChatRole;
};
type Message = {
  id: string;
  content: string;
  replyToMessageId?: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly chatParticipantService: ChatParticipantService,
    private readonly messageService: MessageService
  ) {}
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody()
    { chatInfo }: { chatInfo: createChat },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() _client: Socket
  ): Promise<void> {
    try {
      const newChatRoom = await this.chatService.createChat(chatInfo);
      this.server.emit('chat room created', newChatRoom);
    } catch (error) {
      console.log('joinRoom error:', error); // ← dodaj to
      throw new InternalServerErrorException(
        'Something went wrong with joining to chat' + error
      );
    }
  }
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody()
    { chatParticipant }: { chatParticipant: ChatParticipant },
    @ConnectedSocket() client: Socket
  ) {
    try {
      console.log('joinRoom event received', chatParticipant);
      const data = getDataFromSocket(client);
      const userId = data.userId;
      if (!userId) {
        throw new Error('Something went wrong with userId');
      }
      const existing =
        await this.chatParticipantService.getChatParticipantByProfileAndChat(
          chatParticipant.profileId,
          chatParticipant.chatId
        );

      if (!existing) {
        await this.chatParticipantService.createChatParticipant(
          chatParticipant,
          userId
        );
      }
      const chatId = chatParticipant.chatId;
      await client.join(chatParticipant.chatId);
      await client.join(chatParticipant.chatId);
      console.log('joined room:', chatParticipant.chatId);
      console.log('rooms:', client.rooms);
      this.server
        .to(chatId)
        .emit(`A profile named ${chatParticipant.profileId} entered the chat`);
    } catch (error) {
      console.log('joinRoom error:', error); // ← dodaj to
      throw new InternalServerErrorException(
        'Something went wrong with joining to chat' + error
      );
    }
  }
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody()
    {
      message,
      chatParticipant,
    }: { message: Message; chatParticipant: ChatParticipant },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const chat = chatParticipant.chatId;
      const data = getDataFromSocket(client);
      const userId = data.userId;
      const profileId = data.profileId;
      if (!userId || !profileId) {
        throw new Error('something went wrong with data from jwt token');
      }
      const newMessage = await this.messageService.createMessage(
        message,
        chat,
        profileId,
        userId
      );
      console.log('messag received', newMessage);
      this.server.to(chat).emit('message', newMessage);
    } catch (error) {
      console.log('message error:', error);
      throw new InternalServerErrorException(
        'Something went wrong with joining to chat' + error
      );
    }
  }
  @SubscribeMessage('deleteMessage')
  async deleteMessage(
    @MessageBody()
    {
      message,
      chatParticipant,
    }: {
      message: Message;
      chatParticipant: ChatParticipant;
    },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const chat = chatParticipant.chatId;
      const messageId = message.id;
      const data = getDataFromSocket(client);
      const userId = data.userId;
      const profileId = data.profileId;
      if (!userId || !profileId) {
        throw new Error('something went wrong with data from jwt token');
      }
      const newMessage = await this.messageService.deleteMessage(
        messageId,
        profileId,
        data.userId
      );
      this.server.to(chat).emit('messageDeleted', newMessage);
    } catch (error) {
      console.log('joinRoom error:', error); // ← dodaj to
      throw new InternalServerErrorException(
        'Something went wrong with joining to chat' + error
      );
    }
  }
  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() { chatId }: { chatId: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const data = getDataFromSocket(client);
      const profileId = data.profileId;
      if (!profileId) throw new Error('Profile id not found in token');

      await this.chatParticipantService.deleteChatParticipantByChatAndProfile(
        chatId,
        profileId
      );

      await client.leave(chatId);
      this.server.to(chatId).emit('userLeft', { profileId });
    } catch (error) {
      console.log('joinRoom error:', error);
      throw new InternalServerErrorException(
        'Something went wrong with joining to chat' + error
      );
    }
  }
  handleConnection(client: Socket) {
    try {
      getDataFromSocket(client);
      console.log(`Client ${client.id} was connected `);
    } catch {
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} was disconnected`);
  }
}

function getDataFromSocket(client: Socket): CustomJwtPayload {
  const token: unknown =
    client.handshake.auth?.token || client.handshake.query?.token;
  if (!token) throw new Error('No token provided');
  const JWT = process.env.JWT_TOKEN;
  if (!JWT) {
    throw new Error('No jwt token');
  }
  try {
    return jwt.verify(token as string, JWT) as unknown as CustomJwtPayload;
  } catch {
    throw new Error('Invalid token');
  }
}
