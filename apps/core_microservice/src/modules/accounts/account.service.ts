import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { randomUUID } from 'crypto';
import { createAccountDto } from 'src/databases/dto/create_account.dto';
import { account } from '@prisma/client';
import { updateAccountDto } from 'src/databases/dto/update_account.dto';




@Injectable()
export class AccountService {
  constructor (private prisma : PrismaService){}
  async getAllAccounts(): Promise<account[]> {
    return this.prisma.account.findMany()
  }
  async getAccount(id:string):Promise<account | null>{
    return this.prisma.account.findUnique({
      where:{id:String(id)}
    })
  }
  async createAccount(dto:createAccountDto):Promise<account>{
    return this.prisma.account.create({
      data:{ 
          id: dto.id ?? randomUUID(),
          email:dto.email,
          password_hash:dto.password_hash,
          provider:dto.provider ?? 'local',
          updated_at : new Date(),
          created_by : {connect : {id:dto.user_id}},
          user:{
            connect:{id:dto.user_id}
          }}
        })}
  async updateAccount(id:string , dto : updateAccountDto):Promise<account>{
    return this.prisma.account.update({
      where:{id:String(id)},
      data:{
          email:dto.email,
          password_hash:dto.password_hash,
          provider:dto.provider ?? 'local',
          updated_at:new Date(),
      }
    })
  }
  async deleteAccount(id:string):Promise<account | null>{
    return this.prisma.account.delete({
      where:{id:String(id)}
    })
  }
}
