import { Body, Controller, Delete, Get, Injectable, Param, Patch, Post, Put } from '@nestjs/common';
import { UserModel } from './users.model';
import { UsersService } from './users.service';
import { createUserDto } from 'src/databases/dto/create_user.dto';
import { updateUserDto } from 'src/databases/dto/update_user.dto';
import { user } from '@prisma/client';
import { randomUUID } from 'crypto';

const toUserModel = (entity: user): UserModel => ({
  id: entity.id,
  role: entity.role,
  disabled: entity.disabled as any,
  created_at: entity.created_at,
  updated_at: entity.updated_at,
  created_by_id: entity.crearted_by_id ?? randomUUID(),
  updated_by_id: entity.updated_by_id,
});
@Controller('api/v3/users')
export class UsersController {
  constructor(private readonly usersService : UsersService){}
  @Get()
  async getAllUsers():Promise<UserModel[]>{
    const res = await this.usersService.getAllUsers()
    return res.map(toUserModel)
  }
  
  @Get(':id')
  async getUser(@Param('id') id:string):Promise<UserModel | null>{
    const res = await this.usersService.getUser(id)
    return res ? toUserModel(res) : null
  }
  @Post('create')
  async createUser(@Body() dto:createUserDto):Promise<UserModel>{
    const entity = await this.usersService.createUser(dto)
    return toUserModel(entity)
  }
  @Put('update/:id')
  async updateUser(@Param('id') id:string, @Body() dto:updateUserDto):Promise<UserModel>{
    const entity = await this.usersService.updateUser(id ,dto)
    return toUserModel(entity)
  }
  @Delete('delete/:id')
  async deleteUser(@Param('id') id:string):Promise<UserModel | null>{
    const entity = await this.usersService.deleteUser(id)
    return toUserModel(entity)
  }


}
