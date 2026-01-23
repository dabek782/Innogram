import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAccountDTO } from './dto/register_account.dto';
import { LoginAccountDTO } from './dto/login_account.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth_guard';
import { Routes } from 'src/routes/Routes';
import { Public } from 'src/common/decorators/public.decorator';
@Controller({
  path: Routes.Auth,
  version: '3',
})
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiCreatedResponse({
    description: 'Crated account object based on register Account DTO',
    type: RegisterAccountDTO,
  })
  @Public()
  @Post('register')
  async registerAccount(@Body() dto: RegisterAccountDTO) {
    return this.authService.register(dto);
  }
  @ApiCreatedResponse({
    description: 'Returns object based on login account dto',
    type: LoginAccountDTO,
  })
  @Public()
  @Post('login')
  async loginAccount(@Body() dto: LoginAccountDTO) {
    return await this.authService.login(dto);
  }
}
