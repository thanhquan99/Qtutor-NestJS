import { ApiProperty } from '@nestjs/swagger';
import { TICKET_STATUS } from './../ticket.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ITicket {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  typeId: number;
}

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ITicket)
  @IsArray()
  tickets: [ITicket];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TICKET_STATUS, {
    message: `Status should be in [${TICKET_STATUS.AVAILABLE},${TICKET_STATUS.BOOKED},${TICKET_STATUS.HOLD},${TICKET_STATUS.SOLD}]`,
  })
  status: TICKET_STATUS;
}
