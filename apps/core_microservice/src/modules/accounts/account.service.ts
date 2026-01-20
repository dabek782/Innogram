import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { UpdateAccountDto } from './dto/update_account.dto';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create_account.dto';
import { CreateUserDto } from '../users/dto/create_user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}
  private handleError(error: unknown, message: string): never {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(message);
  }
  async getAllAccounts(): Promise<Account[]> {
    try {
      return this.prisma.account.findMany();
    } catch (error) {
      this.handleError(error, 'Not found any accounts');
    }
  }
  async getAccount(id: string): Promise<Account | null> {
    try {
      return this.prisma.account.findUnique({
        where: { id: String(id) },
      });
    } catch (error) {
      this.handleError(error, `The account with  this ${id} does not exist `);
    }
  }
  async createAccount(
    dto: CreateAccountDto,
    userDto: CreateUserDto
  ): Promise<Account> {
    if (!userDto || !userDto.id) {
      throw new InternalServerErrorException('User data is required');
    }
    return this.prisma.account.create({
      data: {
        id: dto.user_id ?? randomUUID(),
        email: dto.email,
        provider: dto.provider,
        passwordHash: dto.passwordHash,
        user: { connect: { id: userDto.id } },
      },
    });
  }
  async updateAccount(id: string, dto: UpdateAccountDto): Promise<Account> {
    return this.prisma.account.update({
      where: { id: String(id) },
      data: {
        email: dto.email,
        passwordHash: dto.passwordHash,
        provider: dto.provider,
      },
    });
  }
  async deleteAccount(id: string): Promise<Account | null> {
    return this.prisma.account.delete({
      where: { id: String(id) },
    });
  }
}
