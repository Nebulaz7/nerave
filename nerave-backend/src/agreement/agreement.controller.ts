import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AgreementsService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller(['agreement', 'agreements'])
@UseGuards(JwtGuard)
export class AgreementsController {
  constructor(private agreementsService: AgreementsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateAgreementDto, @Request() req) {
    return this.agreementsService.create(dto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.agreementsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.agreementsService.findOne(id, req.user);
  }

  @Post(':agreementId/milestones/:milestoneId/confirm')
  confirmMilestone(
    @Param('agreementId') agreementId: string,
    @Param('milestoneId') milestoneId: string,
    @Request() req,
  ) {
    return this.agreementsService.confirmMilestone(agreementId, milestoneId, req.user);
  }
}