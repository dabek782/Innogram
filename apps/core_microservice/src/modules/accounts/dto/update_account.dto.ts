import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAccountDto } from './create_account.dto';
import { IsEmail } from 'class-validator';
import { Provider } from '@prisma/client';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: 'hashed_password',
    description: 'Hashed password value',
  })
  passwordHash: string;

  @ApiPropertyOptional({ description: 'Auth Provider' })
  provider: Provider;
}
