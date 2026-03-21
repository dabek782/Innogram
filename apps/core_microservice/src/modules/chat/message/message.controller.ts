import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Routes } from 'src/routes/coreRoutes';
import { MessageService } from './message.service';
import { MessageResponseData, toMessageResponseData } from './message.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import * as authGuard from 'src/common/auth_guard';
@UseGuards(authGuard.JwtAuthGuard)
@Controller({
  version: '3',
  path: Routes.Chat,
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId/messages')
  async getMessages(
    @Param('chatId') chatId: string
  ): Promise<MessageResponseData[]> {
    const messages = await this.messageService.getMessages(chatId);
    return messages.map(toMessageResponseData);
  }

  @Post(':chatId/message')
  async createMessage(
    @Param('chatId') chatId: string,
    @Body() dto: CreateMessageDto,
    @Req() req: authGuard.AuthenticatedRequest
  ): Promise<MessageResponseData> {
    if (!req.user?.profileId) {
      throw new UnauthorizedException('Profile id not found in token');
    }
    if (!req.user?.userId) {
      throw new UnauthorizedException('User id not found in token');
    }
    const message = await this.messageService.createMessage(
      dto,
      chatId,
      req.user.profileId,
      req.user.userId
    );
    return toMessageResponseData(message);
  }

  @Put('message/update/:id')
  async updateMessage(
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto,
    @Req() req: authGuard.AuthenticatedRequest
  ): Promise<MessageResponseData> {
    if (!req.user?.profileId) {
      throw new UnauthorizedException('Profile id not found in token');
    }
    if (!req.user?.userId) {
      throw new UnauthorizedException('User id not found in token');
    }
    const message = await this.messageService.updateMessage(
      dto,
      id,
      req.user.profileId,
      req.user.userId
    );
    return toMessageResponseData(message);
  }

  @Delete('message/delete/:id')
  async deleteMessage(
    @Param('id') id: string,
    @Req() req: authGuard.AuthenticatedRequest
  ): Promise<MessageResponseData> {
    if (!req.user?.profileId) {
      throw new UnauthorizedException('Profile id not found in token');
    }
    if (!req.user?.userId) {
      throw new UnauthorizedException('User id not found in token');
    }
    const message = await this.messageService.deleteMessage(
      id,
      req.user.profileId,
      req.user.userId
    );
    return toMessageResponseData(message);
  }
}
