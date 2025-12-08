import { provider } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class registerAccountDTO{
  @ApiProperty({description:'Email user to register the account' ,example: "user@example.com" })
  @IsEmail()
  email:string

  @ApiProperty({description:'Password used to register the account' , example: "StrongP@ssw0rd" })
  @IsString()
  password:string

  @ApiProperty({description:'Provider used to register the account by defoult is local' , enum: provider, required: false })
  @IsOptional()
  @IsEnum(provider)
  provider ?: provider

  @ApiPropertyOptional({description:'User id is generated id that account gets when registering' , required: false })
  @IsOptional()
  @IsString()
  userId?:string
}