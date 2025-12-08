import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerAccountDTO } from 'src/databases/dto/register_account.dto';
import { loginAccountDTO } from 'src/databases/dto/login_account.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/v3/auth')
export class AuthController {
  constructor(private readonly authService : AuthService){}
   @ApiCreatedResponse({
    description:"Crated account object based on register Account DTO",
    type:registerAccountDTO
  })
  @Post('register')
  async registerAccount(@Body() dto:registerAccountDTO){
    return this.authService.register(dto)
  }
  @ApiCreatedResponse({
    description:"Returns object based on login account dto",
    type:loginAccountDTO
  })
  @Post('login')
  async loginAccount(@Body() dto:loginAccountDTO){
    return this.authService.login(dto)
  }
}
