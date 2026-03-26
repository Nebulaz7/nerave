import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtGuard } from './guard/jwt.guard';
import { ApiKeyGuard } from './guard/api-key.guard';
import { CombinedGuard } from './guard/combined.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtGuard, ApiKeyGuard, CombinedGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtGuard, ApiKeyGuard, CombinedGuard],
})
export class AuthModule {}