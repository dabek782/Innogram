import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountModel } from './account.model';
import { createAccountDto } from 'src/databases/dto/create_account.dto';
import { updateAccountDto } from 'src/databases/dto/update_account.dto';
import { AccountService } from './account.service';
import { account } from '@prisma/client';
import { randomUUID } from 'crypto';

const toAccountModel=(entity:account):AccountModel=>({
  id:entity.id ,
  user_id:entity.user_id ?? randomUUID(),
  email:entity.email,
  password_hash : entity.password_hash,
  created_at: entity.created_at,
  updated_at: entity.updated_at,
  provider: entity.provider,
  provider_id : entity.provider_id,
  created_by_id: entity.created_by_id ?? randomUUID(),
  updated_by_id : entity.updated_by_id ?? randomUUID(),
  last_login_at : entity.last_login_at,
})



@ApiTags('Accounts')
@Controller('api/v3/account')
export class AccountController {
  constructor(private readonly accountService : AccountService){}
  @ApiOperation({ summary: 'List all accounts' })
  @ApiResponse({ status: 200, description: 'Array of accounts', type: [AccountModel] })
  @Get()
  async getAllAccounts():Promise<AccountModel[]>{
    const res = await this.accountService.getAllAccounts()
    return res.map(toAccountModel)
  }
  @ApiOperation({ summary: 'Get single account by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Account found', type: AccountModel })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Get(':id')
  async getAccount(@Param('id') id:string):Promise<AccountModel | null>{
    const res = await this.accountService.getAccount(id)
    return res ? toAccountModel(res) : null
  }
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: createAccountDto })
  @ApiResponse({ status: 201, description: 'Account created', type: AccountModel })
  @Post('create')
  async createAccount(@Body() dto:createAccountDto):Promise<AccountModel>{
    const entity = await this.accountService.createAccount(dto)
    return toAccountModel(entity)
  }
  @ApiOperation({ summary: 'Update account by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: updateAccountDto })
  @ApiResponse({ status: 200, description: 'Account updated', type: AccountModel })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Put('update/:id')
  async updateAccount(@Param('id') id:string , @Body() dto:updateAccountDto):Promise<AccountModel>{
    const entity = await this.accountService.updateAccount(id ,dto)
    return toAccountModel(entity)
  }
  @ApiOperation({ summary: 'Delete account by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Account deleted', type: AccountModel })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Delete('delete/:id')
  async deleteAccount(@Param('id') id:string):Promise<AccountModel | null>{
    const entity = await this.accountService.deleteAccount(id)
    return entity ? toAccountModel(entity) : null
  }
}
