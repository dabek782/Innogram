import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Provider } from '@prisma/client';
import {IsEmail,IsEnum, IsString} from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description:"Id for account that is generated from uuid in prisma"
  })
  @IsString()
  user_id?:string
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
  @IsString()
  passwordHash : string
  @IsEnum(Provider)
  @ApiProperty({
    description:"Provider is the enum that has values like local , x ,google  , github but default one is local",
    example:'local',
    enum: Provider,  
  })
  Provider :  Provider 

}