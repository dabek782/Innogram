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
import { Profile as ProfileEntity } from '@prisma/client';
import * as auth_guard from 'src/common/auth_guard';
import { Routes } from 'src/routes/Routes';
import { Public } from 'src/common/decorators/public.decorator';
import { ProfileResponseData } from './profile.model';

const toProfileResponseData = (entity: ProfileEntity) => ({
  userId: entity.userId,
  bio: entity.bio,
  username: entity.username,
  displayName: entity.displayName,
  birthday: entity.birthday,
  avatarUrl: entity.avatarUrl,
  isPublic: entity.isPublic,
});

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
  ): Promise<ProfileResponseData> {
    if (!req.user?.userId) {
      throw new BadRequestException('Something went wrong with id');
    }
    const entity: ProfileEntity = await this.profileService.create(
      dto,
      req.user?.userId
    );
    return toProfileResponseData(entity);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto
  ): Promise<ProfileResponseData> {
    const entity: ProfileEntity = await this.profileService.update(id, dto);
    return toProfileResponseData(entity);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<ProfileEntity> {
    return this.profileService.delete(id);
  }
  @Public()
  @Get('get/:id')
  async getOne(@Param('id') id: string): Promise<ProfileEntity> {
    return this.profileService.getOne(id);
  }

  @Get('get')
  async getAll(): Promise<ProfileEntity[] | null> {
    return this.profileService.getAll();
  }
}
