import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTransactionDto {
    @IsNotEmpty()
    @IsDate()
    transactionTime: Date;

    @IsNotEmpty()
    @IsString()
    service: string;
  }
  