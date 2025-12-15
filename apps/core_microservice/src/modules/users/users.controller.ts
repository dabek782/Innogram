import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserResponseData } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/databases/dto/create_user.dto';
import { UpdateUserDto } from 'src/databases/dto/update_user.dto';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Routes } from 'src/routes/Routes'
const toUserResponseData = (entity: User): UserResponseData => ({
  id: entity.id ?? randomUUID(),
  role: entity.role,
  disabled: entity.disabled as any,
  created_at: entity.createdAt,
  updated_at: entity.updatedAt,
  
  
});

@ApiTags('User')
@Controller({path:Routes.Users , version : '3'})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOkResponse({
    description: 'Gets all users',
    type: UserResponseData,
  })
  @Get()
  async getAllUsers(): Promise<UserResponseData[]> {
    const res = await this.usersService.getAllUsers();
    return res.map(toUserResponseData);
  }
  @ApiOkResponse({
    description: 'Gets user by id',
    type: UserResponseData,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: { example: null },
  })
  @ApiBadRequestResponse({
    description: 'Invalid id',
    schema: { example: null },
  })
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseData | null> {
    const res = await this.usersService.getUser(id);
    return res ? toUserResponseData(res) : null;
  }
  @ApiCreatedResponse({
    description: 'Creates user using CreateUserDto and returns UserResponseData',
    type: UserResponseData,
  })
  @Post('create')
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseData> {
    const entity = await this.usersService.createUser(dto);
    return toUserResponseData(entity);
  }
  @ApiOkResponse({
    description: 'Updates user via id using UpdateUserDto',
    type: UserResponseData,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: { example: null },
  })
  @Put('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserResponseData> {
    const entity = await this.usersService.updateUser(id, dto);
    return toUserResponseData(entity);
  }
  @ApiOkResponse({
    description: 'Deletes user by id and returns the removed user',
    type: UserResponseData,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: { example: null },
  })
  @Delete('delete/:id')
   async deleteUser(@Param('id') id: string): Promise<UserResponseData | null> {
    const entity = await this.usersService.deleteUser(id);
    return toUserResponseData(entity);
  }
}
