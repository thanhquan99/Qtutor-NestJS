import { TicketStatus } from './../ticket.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus, {
    message: `Country should be in [${TicketStatus.AVAILABLE},${TicketStatus.BOOKED}, ${TicketStatus.HOLD}, ${TicketStatus.SOLD}]`,
  })
  status: TicketStatus;
}
