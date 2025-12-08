import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import {  user } from '@prisma/client';
import { createUserDto } from 'src/databases/dto/create_user.dto';
import { updateUserDto } from 'src/databases/dto/update_user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService{
  constructor(private prisma:PrismaService){}
  async getAllUsers() : Promise<user[]>{
    return this.prisma.user.findMany()
  }
  async getUser(id:string , ):Promise<user| null>{
    return this.prisma.user.findUnique({where:{id:String(id)}})
  }
  async createUser(dto:createUserDto):Promise<user>{
    return this.prisma.user.create({
      data:{  id: dto.id ?? randomUUID(),
      role:dto.role ?? "user",
      disabled : dto.disabled ?? false,
      
  }})
  }
  async updateUser(id:string , dto:updateUserDto):Promise<user>{
    return this.prisma.user.update({
      where:{id},
      data :  {
        role:dto.role,
        disabled:dto.disabled,
        updated_by:dto.updated_by ? undefined:undefined
      }
    })
  }
  async deleteUser(id:string):Promise<user>{
    return this.prisma.user.delete({
      where:{id:String(id)}
    })
  }

 }