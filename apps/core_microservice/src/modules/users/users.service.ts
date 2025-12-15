import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private handleError(error: unknown, message: string): never {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(message);
  }
  async getAllUsers(): Promise<User[]> {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      this.handleError(error, 'Not found users');
    }
  }
  async getUser(id: string): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({ where: { id: String(id) } });
    } catch (error) {
      this.handleError(error, 'Not found user with this id');
    }
  }
  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...(dto.id ? { id: dto.id } : {}),
          role: dto.Role,
          disabled: dto.disabled,
        },
      });
    } catch (error) {
      this.handleError(error, 'Failed to create user');
    }
  }
  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      return this.prisma.user.update({
        where: { id },
        data: {
          role: dto.Role,
          disabled: dto.disabled,
        },
      });
    } catch (error) {
      this.handleError(error, 'Failed to update user');
    }
  }
  async deleteUser(id: string): Promise<User> {
    try {
      return this.prisma.user.delete({
        where: { id: String(id) },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete tge user');
    }
  }
}
