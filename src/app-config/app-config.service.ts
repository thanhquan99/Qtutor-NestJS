import { TICKET_STATUS } from './../tickets/ticket.entity';
import { SeatType } from './../seats/seat.entity';
import { Country } from './../movies/movie.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  getAppConfig() {
    return {
      Country,
      SeatType,
      TicketStatus: TICKET_STATUS,
    };
  }
}
