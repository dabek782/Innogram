import {
  BadRequestException,
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
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Routes } from 'src/routes/Routes';
import { Public } from 'src/common/decorators/public.decorator';

const toUserResponseData = (entity: User | null): UserResponseData | null => {
  if (!entity) {
    return null;
  }
  return {
    id: entity.id ?? randomUUID(),
    role: entity.role ?? 'user',
    disabled: entity.disabled ?? false,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
};

@ApiTags('User')
@Controller({ path: Routes.Users, version: '3' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOkResponse({
    description: 'Gets all users',
    type: UserResponseData,
  })
  @Get()
  async getAllUsers(): Promise<(UserResponseData | null)[]> {
    const res = await this.usersService.getAllUsers();
    return res
      .map(toUserResponseData)
      .filter((user): user is UserResponseData => user !== null);
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
  @Public()
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseData | null> {
    const res = await this.usersService.getUser(id);
    return res ? toUserResponseData(res) : null;
  }
  @ApiCreatedResponse({
    description:
      'Creates user using CreateUserDto and returns UserResponseData',
    type: UserResponseData,
  })
  @Post('create')
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseData> {
    const entity = await this.usersService.createUser(dto);
    if (!entity) {
      throw new BadRequestException('Failed to create user');
    }
    const response = toUserResponseData(entity);
    if (!response) {
      throw new BadRequestException('Failed to create user');
    }
    return response;
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
  ): Promise<UserResponseData | null> {
    const entity = await this.usersService.updateUser(id, dto);
    return entity ? toUserResponseData(entity) : null;
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
    return entity ? toUserResponseData(entity) : null;
  }
}
