import { Ticket } from './ticket.entity';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketType } from 'src/ticket-types/ticket-type.entity';
import { ITicket } from './dto/create-ticket.dto';
import { User } from 'src/users/user.entity';
import { Transaction } from 'src/transactions/transactions.entity';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { Seat, SeatTypePrice } from 'src/seats/seat.entity';
import { Country } from 'src/movies/movie.entity';


@Injectable()
export class TicketsService extends BaseServiceCRUD<Ticket> {
  constructor(@InjectRepository(Ticket) repo) {
    super(repo, Ticket, 'ticket');
  }

  async bookTickets(tickets : ITicket[], user : User){
    const transactions  =  tickets.map(async (ticketData):  Promise<Transaction> => {
      const ticket = await Ticket.findOne({
        where : { id: ticketData.id },
        relations : ['seat', 'ticketType'],
      });
      ticket.status = ticketData.status;
      const type = await TicketType.findOne(ticketData.typeId);
      ticket.ticketType = type;
      await ticket.save();
      const transaction = Transaction.create({transaction_time:  new Date(),price: SeatTypePrice[ticket.seat.type] + ticket.ticketType.price, user : user, ticket : ticket})
      await transaction.save();
      return transaction;
    })
    return transactions;
  }
}
