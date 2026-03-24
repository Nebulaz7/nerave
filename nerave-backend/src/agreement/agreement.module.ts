import { Module } from '@nestjs/common';
import { AgreementsService } from './agreement.service';
import { AgreementsController } from './agreement.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  providers: [AgreementsService],
  controllers: [AgreementsController],
  exports: [AgreementsService],
})
export class AgreementsModule {}