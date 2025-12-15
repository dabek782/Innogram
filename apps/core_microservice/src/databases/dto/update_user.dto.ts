import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User Role', enum: ['user', 'admin'] })
  @IsEnum(Role)
  Role?: Role;

  @ApiPropertyOptional({ description: 'Account lock flag', type: Boolean })
  @IsBoolean()
  disabled?: boolean;

  @ApiPropertyOptional({
    description: 'Identifier of the user performing the update',
  })
  @IsString()
  updatedBy?: string;
}
