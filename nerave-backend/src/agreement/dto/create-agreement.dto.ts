import {
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMilestoneDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  amount: number;
}

export class CreateAgreementDto {
  @IsUUID()
  contractorId: string;

  @IsNumber()
  @Min(1)
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateMilestoneDto)
  milestones: CreateMilestoneDto[];
}