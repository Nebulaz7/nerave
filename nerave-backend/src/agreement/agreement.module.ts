import { Module, forwardRef } from '@nestjs/common';
import { AgreementsService } from './agreement.service';
import { AgreementsController } from './agreement.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentsModule } from '../payment/payment.module';

@Module({
  imports: [BlockchainModule, AuthModule, forwardRef(() => PaymentsModule)],
  providers: [AgreementsService],
  controllers: [AgreementsController],
  exports: [AgreementsService],
})
export class AgreementsModule {}