import { TICKET_STATUS } from './../ticket.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(TICKET_STATUS, {
    message: `Country should be in [${TICKET_STATUS.AVAILABLE},${TICKET_STATUS.BOOKED}, ${TICKET_STATUS.HOLD}, ${TICKET_STATUS.SOLD}]`,
  })
  status: TICKET_STATUS;
}
