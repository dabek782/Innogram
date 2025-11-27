import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Injectable()
export class UsersService{
  constructor(private prisma:PrismaService){}
  async findAll(){
    return this.prisma.user.findMany()
  }
  async create(data:{email:string , name:string , password:string, authId:string}){
    return this.prisma.user.create({
      data,
    })

  }
 }