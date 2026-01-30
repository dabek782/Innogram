import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/profile_create.dto';
import { UpdateProfileDto } from './dto/profile_update.dto';
import { Profile } from '@prisma/client';
import * as auth_guard from 'src/common/auth_guard';
import { Routes } from 'src/routes/Routes';
import { Public } from 'src/common/decorators/public.decorator';
@UseGuards(auth_guard.JwtAuthGuard)
@Controller({
  path: Routes.Profile,
  version: '3',
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  async create(
    @Body() dto: CreateProfileDto,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<Profile> {
    if (!req.user?.userId) {
      throw new BadRequestException('Something went wrong with id');
    }
    return this.profileService.create(dto, req.user?.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto
  ): Promise<Profile> {
    return this.profileService.update(id, dto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<Profile> {
    return this.profileService.delete(id);
  }
  @Public()
  @Get('get/:id')
  async getOne(@Param('id') id: string): Promise<Profile> {
    return this.profileService.getOne(id);
  }

  @Get('get')
  async getAll(): Promise<Profile[] | null> {
    return this.profileService.getAll();
  }
}
