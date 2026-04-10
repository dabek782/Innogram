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
  NotFoundException,
} from '@nestjs/common';
import { Routes } from '../../routes/Routes';
import { CommentService } from './comment.service';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';
import * as auth_guard from '../../common/auth_guard';
import { CommentResponseData } from './comment.model';

@Controller({
  path: Routes.Comment,
  version: '3',
})
@UseGuards(auth_guard.JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('post/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: string
  ): Promise<CommentResponseData[]> {
    return await this.commentService.getCommentsByPostId(postId);
  }

  @Post('post/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() dto: createCommentDto,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<CommentResponseData> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    return await this.commentService.createComment(
      dto,
      postId,
      req.user.userId
    );
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() dto: updateCommentDto,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<CommentResponseData> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    const comment = await this.commentService.updateComment(
      dto,
      id,
      req.user.userId
    );
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  async deleteComment(
    @Param('id') id: string,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<{ id: string }> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    const comment = await this.commentService.deleteComment(
      id,
      req.user.userId
    );
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return { id: comment.id };
  }
}
