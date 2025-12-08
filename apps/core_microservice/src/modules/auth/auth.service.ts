import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { registerAccountDTO } from 'src/databases/dto/register_account.dto';
import { PrismaService } from 'src/databases/prisma.service';
import * as bcrypt from 'bcrypt'
import { loginAccountDTO } from 'src/databases/dto/login_account.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(private prisma : PrismaService){}
  async register(dto:registerAccountDTO){
    this.logger.log(`Registering user with ${dto.email}`)
    const existingUser = await this.prisma.account.findUnique({
      where:{email:dto.email}
    })
    if(existingUser){
      this.logger.warn(`User with this${dto.email} already exist`)
      throw new BadRequestException("This email already exist")
    }
    const saltRounds:number = 12
    const hashedPassword = await bcrypt.hash(dto.password , saltRounds)
    const result = await this.prisma.$transaction(async (tx) =>{
      const user = await tx.user.create({data:{ role: 'user'}})
      const account = await tx.account.create({
      data:{
        email:dto.email,
        password_hash:hashedPassword,
        provider:dto.provider ?? "local",
        updated_at:new Date(),
        user: { connect : { id: user.id } },
        created_by:{connect:{id:user.id}},  
        updated_by:{connect:{id:user.id}},
        
      },
      
    })
    return {user , account}
    })
    this.logger.log(`User with id ${result.user.id} registrated`)
    
    
  }
  async validation(email:string , password:string):Promise<any>{
    this.logger.log(`Registering user with ${email}`)
    const existingUser = await this.prisma.account.findUnique({
      where:{email:email}
    })
    if(!existingUser){
      this.logger.warn(`User with this${email} don't exist`)
      throw new BadRequestException("This email is not assigned to any account exist")
    }
   if (existingUser && (await bcrypt.compare(password , existingUser.password_hash))){
      const {password_hash , ...result} = existingUser
      return result
   }
   return null
  }
  async login (dto : loginAccountDTO){
    this.logger.log(`Loggin user with ${dto.email}`)
    const account  = this.validation(dto.email , dto.password)
    return account
  }

}
