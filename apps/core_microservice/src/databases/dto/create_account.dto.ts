import { provider } from "@prisma/client/client"
import {IsEmail,IsEnum} from 'class-validator';

export class createAccountDto {
  id?:string
  created_by_id?: string | null
  updated_by_id?: string | null
  @IsEmail()
  email : string
  password_hash : string
  @IsEnum(provider)
  provider :  provider 
}