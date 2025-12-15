import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterAccountDTO } from 'src/databases/dto/register_account.dto';
import { PrismaService } from 'src/databases/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAccountDTO } from 'src/databases/dto/login_account.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  async register(dto: RegisterAccountDTO) {
    this.logger.log(`Registering user with ${dto.email}`);
    const existingUser = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      this.logger.warn(`User with this${dto.email} already exist`);
      throw new BadRequestException('This email already exist');
    }
    const saltRounds = Number(this.configService.get('SALT_ROUNDS') ?? 12);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const result = await this.prisma.$transaction(async tx => {
      const user = await tx.user.create({ data:{id:dto.userId , role:"user"} });
      const account = await tx.account.create({
        data: {
          email: dto.email,
          passwordHash: hashedPassword,
          provider: dto.Provider ?? 'local',
          user: { connect: { id: user.id } },
        },
      });
      return { user, account };
    });
    this.logger.log(`User with id ${result.user.id} registrated`);
  }
  async validation(email: string, password: string): Promise<any> {
    this.logger.log(`Registering user with ${email}`);
    const existingUser = await this.prisma.account.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      this.logger.warn(`User with this${email} don't exist`);
      throw new BadRequestException(
        'This email is not assigned to any account exist'
      );
    }
    if (
      existingUser &&
      (await bcrypt.compare(password, existingUser.passwordHash))
    ) {
      const { passwordHash, ...result } = existingUser;
      return result;
    }
    return null;
  }
  async login(dto: LoginAccountDTO) {
    this.logger.log(`Loggin user with ${dto.email}`);
    const account = await this.validation(dto.email, dto.password);
    return account;
  }
}
