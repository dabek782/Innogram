import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/auth_guard';
import { Routes } from '../../../routes/coreRoutes';
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
  @Get('chatParticipants/profilesId')
  async getParticipantsByCreatorAndTargetProfileId(
    @Query('creatorProfileId') creatorProfileId: string,
    @Query('targetProfileId') targetProfileId: string
  ) {
    const participants =
      await this.chatParticipantService.getChatByParticipantsProfileIds(
        creatorProfileId,
        targetProfileId
      );
    return participants
      ? participants?.map(toChatParticipantResponseData)
      : null;
  }
  @Get('participants/:profileId')
  async getParticipantByProfileId(
    @Param('profileId') profileId: string
  ): Promise<ChatParticipantResponseData[] | null> {
    const participants =
      await this.chatParticipantService.getChatsByProfileId(profileId);
    return participants
      ? participants?.map(toChatParticipantResponseData)
      : null;
  }
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
