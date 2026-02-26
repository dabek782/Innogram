import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAccountDTO } from './dto/register_account.dto';
import { LoginAccountDTO } from './dto/login_account.dto';
import { AuthenticateGithubAccountDto } from './dto/authenticate_github.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Routes } from 'src/routes/routes';

@Controller({
  path: Routes.Auth,
  version: '3',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiCreatedResponse({
    description: 'Authenticates or registers user - unified endpoint',
    type: RegisterAccountDTO,
  })
  @Post('authenticate')
  async authenticate(@Body() dto: RegisterAccountDTO) {
    return this.authService.authenticateOrRegister(dto);
  }
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
    return await this.authService.login(dto);
  }
  @Post('oauth/github')
  async authenticateGithub(
    @Body()
    dto: AuthenticateGithubAccountDto
  ) {
    return await this.authService.authenticateOAuth({
      provider: 'github',
      providerId: dto.providerId,
      email: dto.email,
      username: dto.username,
      displayName: dto.displayName,
      avatarUrl: dto.avatarUrl,
    });
  }
}
