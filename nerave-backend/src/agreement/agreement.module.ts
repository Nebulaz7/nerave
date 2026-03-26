import { Module } from '@nestjs/common';
import { AgreementsService } from './agreement.service';
import { AgreementsController } from './agreement.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [BlockchainModule, AuthModule],
  providers: [AgreementsService],
  controllers: [AgreementsController],
  exports: [AgreementsService],
})
export class AgreementsModule {}