import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAccountDTO } from 'src/databases/dto/register_account.dto';
import { LoginAccountDTO } from 'src/databases/dto/login_account.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth_guard';
import { Routes } from 'src/routes/Routes'
@Controller({
  path:Routes.Auth,
  version:'3'
})
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiCreatedResponse({
    description: 'Crated account object based on register Account DTO',
    type: RegisterAccountDTO,
  })
  @Post('register')
  async registerAccount(@Body() dto: RegisterAccountDTO) {
    return this.authService.register(dto);
  }
  @ApiCreatedResponse({
    description: 'Returns object based on login account dto',
    type: LoginAccountDTO,
  })
  @Post('login')
  async loginAccount(@Body() dto: LoginAccountDTO) {
    return this.authService.login(dto);
  }
}
