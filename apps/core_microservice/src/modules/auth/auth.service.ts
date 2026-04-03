import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterAccountDTO } from './dto/register_account.dto';
import { PrismaService } from '../../databases/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAccountDTO } from './dto/login_account.dto';
import { ConfigService } from '@nestjs/config';
import { Account } from '@prisma/client';
import { AuthenticateGithubAccountDto } from './dto/authenticate_github.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async authenticateOrRegister(dto: RegisterAccountDTO) {
    this.logger.log(`Authenticating or registering user with ${dto.email}`);

    const existingUser = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      this.logger.warn(
        `User with ${dto.email} already exists, attempting login`
      );

      const isPasswordValid = await bcrypt.compare(
        dto.password,
        existingUser.passwordHash
      );

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for ${dto.email}`);
        throw new BadRequestException('Invalid password');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _passwordHash, ...result } = existingUser;
      this.logger.log(`User ${dto.email} logged in successfully`);
      return {
        userId: result.userId,
        email: result.email,
        accountId: result.id,
        action: 'login' as const,
      };
    }

    // User doesn't exist, register new user
    this.logger.log(`New user, registering ${dto.email}`);
    return await this.registerNewUser(dto);
  }

  private async registerNewUser(dto: RegisterAccountDTO) {
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
          user: { connect: { id: user.id } },
        },
      });
      return { user, account };
    });

    this.logger.log(`User with id ${result.user.id} registered`);
    return {
      userId: result.user.id,
      email: result.account.email,
      accountId: result.account.id,
      action: 'register' as const,
    };
  }

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
          user: { connect: { id: user.id } },
        },
      });
      return { user, account };
    });
    this.logger.log(`User with id ${result.user.id} registrated`);
    return {
      userId: result.user.id,
      email: result.account.email,
      accountId: result.account.id,
    };
  }

  async validation(
    email: string,
    password: string
  ): Promise<Omit<Account, 'passwordHash'> | null> {
    this.logger.log(`Trying to login  user with ${email}`);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...result } = existingUser;
    return result;
  }
  async authenticateOAuth(oauthData: AuthenticateGithubAccountDto) {
    const existingAccount = await this.prisma.account.findFirst({
      where: {
        provider: oauthData.provider,
        providerId: oauthData.providerId,
      },
    });
    if (existingAccount) {
      return {
        userId: existingAccount.userId,
        accountId: existingAccount.id,
      };
    }
    if (oauthData.email) {
      const existingLocalAccount = await this.prisma.account.findFirst({
        where: { email: oauthData.email, provider: 'local' },
      });
      if (existingLocalAccount) {
        const githubAccount = await this.prisma.account.create({
          data: {
            email: oauthData.email,
            passwordHash: '',
            provider: oauthData.provider,
            providerId: oauthData.providerId,
            userId: existingLocalAccount.userId,
          },
        });

        return {
          userId: githubAccount.userId,
          accountId: githubAccount.id,
          profileId: null,
        };
      }
    }
    const result = await this.prisma.$transaction(async tx => {
      if (!oauthData.email) {
        throw new Error('Email is required for OAuth authentication');
      }
      const user = await tx.user.create({
        data: { role: 'user' },
      });

      const account = await tx.account.create({
        data: {
          email: oauthData.email,
          passwordHash: '',
          provider: oauthData.provider,
          providerId: oauthData.providerId,
          userId: user.id,
        },
      });

      return { user, account };
    });
    return {
      userId: result.user.id,
      accountId: result.account.id,
    };
  }
}
