import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ChatParticipant } from '@prisma/client';
import { PrismaService } from 'src/databases/prisma.service';
import { CreateChatParticipantDto } from './dto/create-chat-participant.dto';
import { UpdateChatParticipantDto } from './dto/update-chat-participant.dto';

@Injectable()
export class ChatParticipantService {
  constructor(private prisma: PrismaService) {}
  private handleError(error: unknown, message: string): never {
    console.log(error);
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(message);
  }
  async getAll(): Promise<ChatParticipant[]> {
    try {
      const participants = await this.prisma.chatParticipant.findMany();
      return participants;
    } catch (error) {
      this.handleError(error, 'Could not find any chat participants');
    }
  }
  async getChatParticipant(id: string): Promise<ChatParticipant | null> {
    try {
      return await this.prisma.chatParticipant.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, `The participant with this ${id} was not found`);
    }
  }
  async createChatParticipant(
    dto: CreateChatParticipantDto,
    userId: string
  ): Promise<ChatParticipant> {
    try {
      console.log('data being inserted:', {
        profileId: dto.profileId,
        role: dto.role,
        chatId: dto.chatId,
        createdById: userId,
        updatedById: userId,
      });
      const chatParticipant = await this.prisma.chatParticipant.create({
        data: {
          profileId: dto.profileId,
          role: dto.role,
          chatId: dto.chatId,
          createdById: userId,
        },
      });
      console.log('created:', chatParticipant);
      return chatParticipant;
    } catch (error) {
      this.handleError(error, 'Chat participant was not created');
    }
  }
  async updateChatParticipant(
    dto: UpdateChatParticipantDto,
    id: string
  ): Promise<ChatParticipant> {
    try {
      const chatParticipant = await this.prisma.chatParticipant.update({
        where: { id: id },
        data: {
          profileId: dto.profileId,
          role: dto.role,
          chatId: dto.chatId,
        },
      });
      return chatParticipant;
    } catch (error) {
      this.handleError(
        error,
        `Did not update chat particiapant with this${id}`
      );
    }
  }
  async deleteChatParticipant(id: string): Promise<ChatParticipant> {
    try {
      return this.prisma.chatParticipant.delete({ where: { id } });
    } catch (error) {
      this.handleError(
        error,
        `Did not delete chat participant with that ${id}`
      );
    }
  }
  async deleteChatParticipantByChatAndProfile(
    chatId: string,
    profileId: string
  ): Promise<void> {
    try {
      await this.prisma.chatParticipant.delete({
        where: { profileId_chatId: { profileId, chatId } },
      });
    } catch (error) {
      this.handleError(error, 'Failed to leave chat');
    }
  }
  async getChatParticipantByProfileAndChat(
    profileId: string,
    chatId: string
  ): Promise<ChatParticipant | null> {
    try {
      return await this.prisma.chatParticipant.findUnique({
        where: { profileId_chatId: { profileId, chatId } },
      });
    } catch (error) {
      this.handleError(error, 'Failed to find chat participant');
    }
  }
  async getChatsByProfileId(
    profileId: string
  ): Promise<ChatParticipant[] | null> {
    try {
      const data = await this.prisma.chatParticipant.findMany({
        where: { profileId },
      });
      return data;
    } catch (error) {
      this.handleError(
        error,
        'Failed to find any info about chat that this profile was part in'
      );
    }
  }
  async getChatByParticipantsProfileIds(
    creatorProfileId: string,
    targetProfileId: string
  ): Promise<ChatParticipant[] | null> {
    try {
      const data = await this.prisma.chatParticipant.findMany({
        where: {
          profileId: creatorProfileId,
          chat: {
            type: 'private',
            chatParticipants: {
              some: {
                profileId: targetProfileId,
              },
            },
          },
        },
      });
      return data.length ? data : null;
    } catch (error) {
      this.handleError(error, 'Failed to get chat by participants profile ids');
    }
  }
}
