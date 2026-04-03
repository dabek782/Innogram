import {
  BadGatewayException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../databases/prisma.service';
import { Message } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  private handleError(error: unknown, message: string): never {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(message);
  }

  async getMessages(chatId: string): Promise<Message[]> {
    try {
      const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat) {
        throw new NotFoundException(`Chat with id ${chatId} not found`);
      }
      return await this.prisma.message.findMany({
        where: { chatId, deleted: false },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      this.handleError(error, 'Failed to get messages');
    }
  }

  async createMessage(
    dto: CreateMessageDto,
    chatId: string,
    profileId: string,
    userId: string
  ): Promise<Message> {
    try {
      const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat) {
        throw new NotFoundException(`Chat with id ${chatId} not found`);
      }
      return await this.prisma.message.create({
        data: {
          content: dto.content,
          chatId,
          profileId,
          replyToMessageId: dto.replyToMessageId ?? null,
          createdById: userId,
          updatedById: userId,
        },
      });
    } catch (error) {
      this.handleError(error, 'Failed to create message');
    }
  }

  async updateMessage(
    dto: UpdateMessageDto,
    id: string,
    profileId: string,
    userId: string
  ): Promise<Message> {
    try {
      const message = await this.prisma.message.findUnique({ where: { id } });
      if (!message) {
        throw new NotFoundException(`Message with id ${id} not found`);
      }
      if (message.profileId !== profileId) {
        throw new UnauthorizedException(
          'You are not authorized to edit this message'
        );
      }
      return await this.prisma.message.update({
        where: { id },
        data: {
          content: dto.content,
          isEdited: true,
          updatedById: userId,
        },
      });
    } catch (error) {
      this.handleError(error, 'Failed to update message');
    }
  }

  async deleteMessage(
    id: string,
    profileId: string,
    userId: string
  ): Promise<Message> {
    try {
      const message = await this.prisma.message.findUnique({ where: { id } });
      if (!message) {
        throw new NotFoundException(`Message with id ${id} not found`);
      }
      if (message.profileId !== profileId) {
        throw new UnauthorizedException(
          'You are not authorized to delete this message'
        );
      }
      return await this.prisma.message.update({
        where: { id },
        data: {
          deleted: true,
          updatedById: userId,
        },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete message');
    }
  }
  async getMessageByProfileIdAndChatId(
    profileId: string,
    chatId: string
  ): Promise<Message[] | null> {
    if (!profileId || !chatId) {
      throw new BadGatewayException('Profile or chat is not given');
    }
    try {
      return await this.prisma.message.findMany({
        where: { profileId, chatId },
      });
    } catch (error) {
      this.handleError(
        error,
        `Failed to get any data that has this${profileId} and this ${chatId} `
      );
    }
  }
}
