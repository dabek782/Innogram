import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth_guard';
import { Routes } from 'src/routes/coreRoutes';
import { ChatService } from './chat.service';
import { toChatResponseData, ChatResponseData } from './chat.model';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
@UseGuards(JwtAuthGuard)
@Controller({
  version: '3',
  path: Routes.Chat,
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get(':id')
  async getChat(@Param('id') id: string): Promise<ChatResponseData | null> {
    const chat = await this.chatService.getChat(id);
    return chat ? toChatResponseData(chat) : null;
  }
  @Get()
  async getAllChat(): Promise<ChatResponseData[] | null> {
    const chat = await this.chatService.getAll();
    return chat ? chat.map(toChatResponseData) : null;
  }
  @Post('create')
  async createChat(
    @Body() dto: CreateChatDto
  ): Promise<ChatResponseData | null> {
    const chat = await this.chatService.createChat(dto);
    return chat ? toChatResponseData(chat) : null;
  }
  @Put('update/:id')
  async updateChat(
    @Param('id') id: string,
    @Body() dto: UpdateChatDto
  ): Promise<ChatResponseData | null> {
    const chat = await this.chatService.updateChat(dto, id);
    return chat ? toChatResponseData(chat) : null;
  }
  @Delete(':id')
  async deleteChat(@Param('id') id: string): Promise<ChatResponseData | null> {
    const chat = await this.chatService.deleteChat(id);
    return chat ? toChatResponseData(chat) : null;
  }
}
