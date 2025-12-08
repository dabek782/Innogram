import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { createAccountDto } from './create_account.dto';
import { IsEmail } from 'class-validator';
import { provider } from '@prisma/client';

export class updateAccountDto extends PartialType(createAccountDto) {
  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'hashed_password', description: 'Hashed password value' })
  password_hash: string;

  @ApiPropertyOptional({ enum: provider, description: 'Auth provider' })
  provider: provider;
}