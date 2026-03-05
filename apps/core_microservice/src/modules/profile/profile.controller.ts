import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/profile_create.dto';
import { UpdateProfileDto } from './dto/profile_update.dto';
import { Profile as ProfileEntity } from '@prisma/client';
import * as auth_guard from 'src/common/auth_guard';
import { Routes } from 'src/routes/routes';
import { ProfileResponseData, toProfileResponseData } from './profile.model';
import { currentUser } from 'src/common/decorators/currentUser.decorator';
import type { CustomJwtPayload } from 'src/types/custom-jwt';

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
    @currentUser() user: CustomJwtPayload
  ): Promise<ProfileResponseData> {
    if (!user?.userId) {
      throw new BadRequestException('Something went wrong with id');
    }
    const entity: ProfileEntity = await this.profileService.create(
      dto,
      user.userId
    );
    return toProfileResponseData(entity);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto
  ): Promise<ProfileResponseData> {
    const entity: ProfileEntity = await this.profileService.update(id, dto);
    return toProfileResponseData(entity);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<ProfileEntity> {
    return this.profileService.delete(id);
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string): Promise<ProfileEntity> {
    return this.profileService.getOne(id);
  }

  @Get('get')
  async getAll(): Promise<ProfileEntity[] | null> {
    return this.profileService.getAll();
  }
  @Get('getusername/:userId')
  async getUsernameByUserId(
    @Param('userId') userId: string
  ): Promise<{ username: string | null }> {
    const username = await this.profileService.getUsernameByUserId(userId);
    return { username };
  }
  @Get('get/username/:username')
  async getByUsername(
    @Param('username') username: string
  ): Promise<ProfileEntity | null> {
    const profile = await this.profileService.getOneByUsername(username);
    return profile;
  }
}
