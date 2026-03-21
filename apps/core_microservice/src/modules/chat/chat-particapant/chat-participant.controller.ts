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
import { ChatParticipantService } from './chat-participant.service';
import {
  ChatParticipantResponseData,
  toChatParticipantResponseData,
} from './chat-participant.model';
import { CreateChatParticipantDto } from './dto/create-chat-participant.dto';
import { UpdateChatParticipantDto } from './dto/update-chat-participant.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  version: '3',
  path: Routes.Chat,
})
export class ChatParticipantController {
  constructor(
    private readonly chatParticipantService: ChatParticipantService
  ) {}

  @Get('participants')
  async getAll(): Promise<ChatParticipantResponseData[]> {
    const participants = await this.chatParticipantService.getAll();
    return participants.map(toChatParticipantResponseData);
  }

  @Get('participant/:id')
  async getChatParticipant(
    @Param('id') id: string
  ): Promise<ChatParticipantResponseData | null> {
    const participant =
      await this.chatParticipantService.getChatParticipant(id);
    return participant ? toChatParticipantResponseData(participant) : null;
  }

  @Post('participant/create')
  async createChatParticipant(
    @Body() dto: CreateChatParticipantDto,
    userId: string
  ): Promise<ChatParticipantResponseData> {
    const participant = await this.chatParticipantService.createChatParticipant(
      dto,
      userId
    );
    return toChatParticipantResponseData(participant);
  }

  @Put('participant/update/:id')
  async updateChatParticipant(
    @Param('id') id: string,
    @Body() dto: UpdateChatParticipantDto
  ): Promise<ChatParticipantResponseData | null> {
    const participant = await this.chatParticipantService.updateChatParticipant(
      dto,
      id
    );
    return participant ? toChatParticipantResponseData(participant) : null;
  }

  @Delete('participant/delete/:id')
  async deleteChatParticipant(
    @Param('id') id: string
  ): Promise<ChatParticipantResponseData> {
    const participant =
      await this.chatParticipantService.deleteChatParticipant(id);
    return toChatParticipantResponseData(participant);
  }
}
