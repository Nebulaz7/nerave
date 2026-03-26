import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const apiKey = `pk_test_${randomUUID().replace(/-/g, '')}`;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        businessName: dto.businessName,
        passwordHash,
        apiKey,
        role: dto.role,
      },
    });

    return {
      message: 'Registration successful',
      apiKey: user.apiKey,
      userId: user.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: user.id, email: user.email });
    this.logger.log(`[LOGIN SUCCESS] User: ${user.email} | JWT: ${token}`);

    return {
      accessToken: token,
      apiKey: user.apiKey,
      userId: user.id,
      role: user.role,
    };
  }
}