import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserModel } from './users.model';
import { UsersService } from './users.service';
import { createUserDto } from 'src/databases/dto/create_user.dto';
import { updateUserDto } from 'src/databases/dto/update_user.dto';
import { user } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse
} from '@nestjs/swagger';

const toUserModel = (entity: user): UserModel => ({
  id: entity.id ?? randomUUID(),
  role: entity.role,
  disabled: entity.disabled as any,
  created_at: entity.created_at,
  updated_at: entity.updated_at,
  crearted_by_id: entity.created_by_id ?? randomUUID(),
  updated_by_id: entity.updated_by_id ?? randomUUID()
});
@Controller('api/v3/users')
export class UsersController {
  constructor(private readonly usersService : UsersService){}
  @ApiOkResponse({
    description:'Gets all users',
    type: UserModel
  })
  @Get()
  async getAllUsers():Promise<UserModel[]>{
    const res = await this.usersService.getAllUsers()
    return res.map(toUserModel)
  }
    @ApiOkResponse({
    description:'Gets user by id',
    type: UserModel
  })
    @ApiNotFoundResponse({
      description:'User not found',
      schema:{ example: null }
    })
    @ApiBadRequestResponse({
      description:'Invalid id',
      schema:{ example: null }
    })
  @Get(':id')
  async getUser(@Param('id') id:string):Promise<UserModel | null>{
    const res = await this.usersService.getUser(id)
    return res ? toUserModel(res) : null
  }
  @ApiCreatedResponse({
    description:'Creates user using createUserDto and returns UserModel',
    type: UserModel
  })
  @Post('create')
  async createUser(@Body() dto:createUserDto):Promise<UserModel>{
    const entity = await this.usersService.createUser(dto)
    return toUserModel(entity)
  }
  @ApiOkResponse({
    description:'Updates user via id using updateUserDto',
    type: UserModel
  })
  @ApiNotFoundResponse({
    description:'User not found',
    schema:{ example: null }
  })
  @Put('update/:id')
  async updateUser(@Param('id') id:string, @Body() dto:updateUserDto):Promise<UserModel>{
    const entity = await this.usersService.updateUser(id ,dto)
    return toUserModel(entity)
  }
  @ApiOkResponse({
    description:'Deletes user by id and returns the removed user',
    type: UserModel
  })
  @ApiNotFoundResponse({
    description:'User not found',
    schema:{ example: null }
  })
  @Delete('delete/:id')
  async deleteUser(@Param('id') id:string):Promise<UserModel | null>{
    const entity = await this.usersService.deleteUser(id)
    return toUserModel(entity)
  }


}
