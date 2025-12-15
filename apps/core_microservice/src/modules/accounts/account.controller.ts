import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountResponseData } from './account.model';
import { CreateAccountDto } from 'src/databases/dto/create_account.dto';
import { UpdateAccountDto } from 'src/databases/dto/update_account.dto';
import { AccountService } from './account.service';
import { Account } from '@prisma/client';
import { CreateUserDto } from 'src/databases/dto/create_user.dto';
import { Routes } from 'src/routes/Routes'
const toAccountResponseData = (entity: Account): AccountResponseData => ({
  email: entity.email,
  password_hash: entity.passwordHash,
  provider: entity.provider,
});

@ApiTags('Accounts')
@Controller({
  path:Routes.Account ,
  version:'3'
})
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @ApiOperation({ summary: 'List all accounts' })
  @ApiResponse({
    status: 200,
    description: 'Array of accounts',
    type: [AccountResponseData],
  })
  @Get()
  async getAllAccounts(): Promise<AccountResponseData[]> {
    const res = await this.accountService.getAllAccounts();
    return res.map(toAccountResponseData);
  }
  @ApiOperation({ summary: 'Get single Account by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Account found',
    type: AccountResponseData,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Get(':id')
  async getAccount(@Param('id') id: string): Promise<AccountResponseData | null> {
    const res = await this.accountService.getAccount(id);
    return res ? toAccountResponseData(res) : null;
  }
  @ApiOperation({ summary: 'Create a new Account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 201,
    description: 'Account created',
    type: AccountResponseData,
  })
  @Post('create')
  async createAccount(@Body() dto: CreateAccountDto , userDto:CreateUserDto): Promise<AccountResponseData> {
    const entity = await this.accountService.createAccount(dto, userDto);
    return toAccountResponseData(entity);
  }
  @ApiOperation({ summary: 'Update Account by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({
    status: 200,
    description: 'Account updated',
    type: AccountResponseData,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Put('update/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto
  ): Promise<AccountResponseData> {
    const entity = await this.accountService.updateAccount(id, dto);
    return toAccountResponseData(entity);
  }
  @ApiOperation({ summary: 'Delete Account by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Account deleted',
    type: AccountResponseData,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Delete('delete/:id')
  async deleteAccount(@Param('id') id: string): Promise<AccountResponseData | null> {
    const entity = await this.accountService.deleteAccount(id);
    return entity ? toAccountResponseData(entity) : null;
  }
}
