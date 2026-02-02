import {
  ConflictException,
  Injectable,
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

    return this.prisma.profile.create({
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

    return this.prisma.profile.update({
      where: { id },
      data: {
        ...(dto.username !== undefined && { username: dto.username }),
        ...(dto.displayName !== undefined && { displayName: dto.displayName }),
        ...(dto.birthday !== undefined && { birthday: new Date(dto.birthday) }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
      },
    });
  }

  async delete(id: string): Promise<Profile> {
    const existing = await this.prisma.profile.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Profile not found');
    }
    return this.prisma.profile.delete({ where: { id } });
  }

  async getOne(id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findFirst({
      where: { userId: { equals: id } },
    });
    console.log(profile);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async getAll(): Promise<Profile[] | null> {
    const profiles = await this.prisma.profile.findMany();
    return profiles ? profiles : null;
  }
}
