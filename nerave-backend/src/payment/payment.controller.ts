import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { PaymentsService } from './payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate/:agreementId')
  @UseGuards(JwtGuard)
  initiate(@Param('agreementId') agreementId: string) {
    return this.paymentsService.initiatePayment(agreementId);
  }

  @Get('verify/:transactionRef')
  verify(@Param('transactionRef') transactionRef: string) {
    return this.paymentsService.verifyPayment(transactionRef);
  }

  @Get('mock-pay/:transactionRef')
  async mockPay(@Param('transactionRef') transactionRef: string) {
    await this.paymentsService.verifyPayment(transactionRef);
    return { message: 'Mock payment completed', transactionRef };
  }
}
