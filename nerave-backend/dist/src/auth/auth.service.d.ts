import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        apiKey: string;
        userId: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        apiKey: string;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
