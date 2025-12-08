import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { provider } from '@prisma/client';
import {IsEmail,IsEnum, IsString} from 'class-validator';

export class createAccountDto {

  id?:string
  created_by_id?: string | null
  updated_by_id?: string | null
  @ApiProperty({
    description:'Email of the account',
    example:'abc@xyz.pl'
  })
  @IsEmail()
  email : string
  @ApiProperty({
    description:'Password of the account',
    example:'Password123'
  })
  password_hash : string
  @IsEnum(provider)
  @ApiProperty({
    description:"Provider is the enum that has values like local , x ,google  , github but default one is local",
    example:'local',
    enum: provider,

      
  })
  provider :  provider 
  @ApiProperty({
    description:"its the user id that gets inserted when creating account",
  })
  @IsString()
  @ApiPropertyOptional({description:"Id created via uuid in prisma"})
  user_id?:string
}