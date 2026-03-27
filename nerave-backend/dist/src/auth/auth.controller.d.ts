import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
