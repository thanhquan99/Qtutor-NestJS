import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  transactionTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  service: string;
}
