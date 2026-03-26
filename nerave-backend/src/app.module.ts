import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AuthModule } from './auth/auth.module';
import { AgreementsModule } from './agreement/agreement.module';
import { PaymentsModule } from './payment/payment.module';
import { WebhooksModule } from './payment/webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BlockchainModule,
    AgreementsModule,
    PaymentsModule,
    WebhooksModule,
  ],
})
export class AppModule {}
