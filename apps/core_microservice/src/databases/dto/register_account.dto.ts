import { Provider } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class RegisterAccountDTO {
  @ApiProperty({
    description: 'Email user to register the account',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password used to register the account',
    example: 'StrongP@ssw0rd',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Provider used to register the account by defoult is local',
    enum: Provider,
    required: false,
  })
  @IsOptional()
  @IsEnum(Provider)
  Provider?: Provider;

  @ApiPropertyOptional({
    description: 'User id is generated id that account gets when registering',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
