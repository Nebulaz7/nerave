import { Module } from '@nestjs/common';
import { PaymentsController } from './payment.controller';
import { PaymentsService } from './payment.service';
import { OAuthHelper } from './helpers/oauth.helper';
import { LegacyAuthHelper } from './helpers/legacy-auth.helper';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, OAuthHelper, LegacyAuthHelper],
  exports: [PaymentsService],
})
export class PaymentsModule {}
