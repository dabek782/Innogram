import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class loginAccountDTO{
  @ApiProperty({
    description:'Email used to login user',
    example:'abc@xyz.pl'
  })
  @IsEmail()
  email:string
  @ApiProperty({
    description:'Password used to login the user , it must be a string ',
    example: 'Password123'
  })
  @IsString()
  password:string
}