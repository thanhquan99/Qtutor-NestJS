import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { TransactionPayType } from '../../constant';

export class UpdateTransactionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(Object.values(TransactionPayType))
  payType: string;
}

export class ExecutePaypalPaymentDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  payerId: string;
}