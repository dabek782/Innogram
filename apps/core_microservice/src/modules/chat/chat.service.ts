import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../databases/prisma.service';
import { Chat } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  private handleError(error: unknown, message: string): never {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(message);
  }
  async getAll(): Promise<Chat[]> {
    try {
      return await this.prisma.chat.findMany();
    } catch (error) {
      this.handleError(error, 'Not found any chats');
    }
  }
  async getChat(id: string): Promise<Chat | null> {
    try {
      return this.prisma.chat.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'Not found chat with this id');
    }
  }
  async createChat(dto: CreateChatDto): Promise<Chat> {
    try {
      const chat = await this.prisma.chat.create({
        data: {
          name: dto.name,
          description: dto.description,
          type: dto.type,
        },
      });
      return chat;
    } catch (error) {
      this.handleError(error, 'Chat was not create');
    }
  }
  async updateChat(dto: UpdateChatDto, id: string): Promise<Chat> {
    try {
      const chat = await this.prisma.chat.update({
        where: { id: id },
        data: {
          name: dto.name,
          description: dto.description,
          type: dto.type,
        },
      });
      return chat;
    } catch (error) {
      this.handleError(error, 'Failed with updating chat');
    }
  }
  async deleteChat(id: string) {
    return await this.prisma.chat.delete({ where: { id: id } });
  }
}
