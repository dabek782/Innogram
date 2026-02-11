import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { CreateProfileDto } from './dto/profile_create.dto';
import { UpdateProfileDto } from './dto/profile_update.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfileDto, userId: string): Promise<Profile> {
    const existingByUsername = await this.prisma.profile.findUnique({
      where: { username: dto.username },
    });
    if (existingByUsername) {
      throw new ConflictException('Username is already taken');
    }
    try {
      const profile = await this.prisma.profile.create({
        data: {
          userId: userId,
          username: dto.username,
          displayName: dto.displayName,
          birthday: new Date(dto.birthday),
          bio: dto.bio,
          avatarUrl: dto.avatarUrl,
          isPublic: dto.isPublic ?? true,
          createdById: userId,
        },
      });

      return profile;
    } catch (error: unknown) {
      console.log('Failed to create profile:', error);
      throw new InternalServerErrorException('Failed to create profile');
    }
  }

  async update(id: string, dto: UpdateProfileDto): Promise<Profile> {
    const existing = await this.prisma.profile.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Profile not found');
    }

    if (dto.username) {
      const existingByUsername = await this.prisma.profile.findUnique({
        where: { username: dto.username },
      });
      if (existingByUsername && existingByUsername.id !== id) {
        throw new ConflictException('Username is already taken');
      }
    }
    try {
      const updatedData: UpdateProfileDto = { ...dto };
      if (updatedData.birthday) {
        updatedData.birthday = new Date(updatedData.birthday).toISOString();
      }
      const profile = await this.prisma.profile.update({
        where: { id },
        data: updatedData,
      });
      return profile;
    } catch (error) {
      console.log('Failed to create profile:', error);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async delete(id: string): Promise<Profile> {
    const existing = await this.prisma.profile.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Profile not found');
    }
    try {
      const profile = await this.prisma.profile.delete({ where: { id } });
      return profile;
    } catch (error) {
      console.log('Failed to create profile:', error);
      throw new InternalServerErrorException('Failed to create profile');
    }
  }

  async getOne(id: string): Promise<Profile> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { userId: { equals: id } },
      });
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }
      return profile;
    } catch (error) {
      console.log('Failed to create profile:', error);
      throw new InternalServerErrorException('Failed to create profile');
    }
  }

  async getAll(): Promise<Profile[] | null> {
    try {
      const profiles = await this.prisma.profile.findMany();
      return profiles ? profiles : null;
    } catch (error) {
      console.log('Failed to create profile:', error);
      throw new InternalServerErrorException('Failed to create profile');
    }
  }
}
