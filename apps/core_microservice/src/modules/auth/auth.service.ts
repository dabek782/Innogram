import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterAccountDTO } from './dto/register_account.dto';
import { PrismaService } from 'src/databases/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAccountDTO } from './dto/login_account.dto';
import { ConfigService } from '@nestjs/config';
import { Account } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
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
      const user = await tx.user.create({
        data: { id: dto.userId, role: 'user' },
      });
      const account = await tx.account.create({
        data: {
          email: dto.email,
          passwordHash: hashedPassword,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          provider: dto.provider ?? 'local',
          user: { connect: { id: user.id } },
        },
      });
      return { user, account };
    });
    this.logger.log(`User with id ${result.user.id} registrated`);
    return { userId: result.user.id, email: result.account.email };
  }
  async validation(
    email: string,
    password: string
  ): Promise<Omit<Account, 'passwordHash'> | null> {
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
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for ${email}`);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...result } = existingUser;
    return result;
  }
  async login(dto: LoginAccountDTO): Promise<Omit<Account, 'passwordHash'>> {
    this.logger.log(`Loggin user with ${dto.email}`);
    const account = await this.validation(dto.email, dto.password);
    if (!account) {
      this.logger.warn('Invalid password or email');
      throw new BadRequestException('Something went wrong during login');
    }
    return account;
  }
  async refreshToken(email: string) {
    const existingUser = await this.prisma.account.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      this.logger.warn(`The user with this ${email} does not exist`);
      throw new BadRequestException(
        'This email is not assigned to any account exist'
      );
    }
  }
}
