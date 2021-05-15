import { TRANSACTION_SERVICE } from './../transactions/transactions.entity';
import { Ticket, TICKET_STATUS as TICKET_STATUS } from './ticket.entity';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketType } from 'src/ticket-types/ticket-type.entity';
import { ITicket } from './dto/create-ticket.dto';
import { User } from 'src/users/user.entity';
import { Transaction } from 'src/transactions/transactions.entity';
import { SEAT_TYPE_PRICE } from 'src/seats/seat.entity';
import { EntityManager, getManager } from 'typeorm';
import e from 'express';

@Injectable()
export class TicketsService extends BaseServiceCRUD<Ticket> {
  constructor(@InjectRepository(Ticket) repo) {
    super(repo, Ticket, 'ticket');
  }

  async createTransaction(
    entityManager: EntityManager,
    ticket: Ticket,
    user: User,
  ): Promise<Transaction> {
    const transaction = entityManager.create(Transaction, {
      transaction_time: new Date(),
      price: SEAT_TYPE_PRICE[ticket.seat.type] + ticket.ticketType.price,
      user: user,
      ticket: ticket,
      service: TRANSACTION_SERVICE[ticket.status],
    });

    await entityManager.save(Transaction, transaction);
    return transaction;
  }

  async updateTicket(
    entityManager: EntityManager,
    ticket: Ticket,
    ticketData: ITicket,
    status: string,
  ): Promise<void> {
    ticket.status = status;
    const ticketType = await TicketType.findOne(ticketData.typeId);
    ticket.ticketType = ticketType;
    await entityManager.save(Ticket, ticket);
  }

  async deleteTransaction(
    entityManager: EntityManager,
    ticket: Ticket,
    transactionService: string,
    user: User,
  ): Promise<void> {
    const transaction = await Transaction.findOne({
      where: {
        ticket: ticket,
        service: transactionService,
        user,
      },
    });
    if (transaction) {
      await entityManager.delete(Transaction, transaction.id);  
    };
  }

  async bookTickets(ticketsData: ITicket[], status: string, user: User) {
    return await getManager().transaction(async (entityManager) => {
      return Promise.all(
        ticketsData.map(
          async (ticketData): Promise<Transaction | { message: string }> => {
            const ticket = await Ticket.findOne({
              where: { id: ticketData.id },
              relations: ['seat', 'ticketType', 'holder'],
            });
            if (!ticket) {
              throw new NotFoundException('Ticket not found');
            }

            if (ticket.status === TICKET_STATUS.SOLD) {
              throw new BadRequestException('This ticket is already sold');
            }

            if (ticket.holder?.id && ticket.holder.id !== user.id) {
              throw new BadRequestException(
                'This ticket is already held by another user',
              );
            }

            if (ticket.status === status) {
              throw new BadRequestException(`This ticket already is ${status}`);
            }

            let transaction : Transaction;
            if (ticket.status === TICKET_STATUS.BOOKED) {
              if (status === TICKET_STATUS.AVAILABLE) {
                await this.updateTicket(entityManager, ticket, ticketData, status);
                await this.deleteTransaction(
                  entityManager,
                  ticket,
                  TRANSACTION_SERVICE.Available,
                  user,
                );
                
                transaction = await this.createTransaction(entityManager, ticket, user);
                ticket.holder = null;
                await entityManager.save(Ticket, ticket);
              }
              if (status === TICKET_STATUS.HOLD) {
                throw new BadRequestException('This ticket is already booked');
              }
              if (status === TICKET_STATUS.SOLD) {
                await this.updateTicket(entityManager, ticket, ticketData, status);
                await this.deleteTransaction(
                  entityManager,
                  ticket,
                  TRANSACTION_SERVICE.Sold,
                  user,
                );
                transaction = await this.createTransaction(entityManager, ticket, user);
              }
            }

            if (ticket.status === TICKET_STATUS.HOLD) {
              if (status === TICKET_STATUS.AVAILABLE) {
                await this.updateTicket(entityManager, ticket, ticketData, status);
                await this.deleteTransaction(
                  entityManager,
                  ticket,
                  TRANSACTION_SERVICE.Available,
                  user,
                );
                this.createTransaction(entityManager, ticket, user);
                ticket.holder = null;
                await entityManager.save(Ticket, ticket);
              }
              if (status === TICKET_STATUS.BOOKED) {
                await this.updateTicket(entityManager, ticket, ticketData, status);
                await this.deleteTransaction(
                  entityManager,
                  ticket,
                  TRANSACTION_SERVICE.Booked,
                  user,
                );
                transaction = await this.createTransaction(entityManager, ticket, user);
              }

              if (status === TICKET_STATUS.SOLD) {
                await this.updateTicket(entityManager, ticket, ticketData, status);
                await this.deleteTransaction(
                  entityManager,
                  ticket,
                  TRANSACTION_SERVICE.Sold,
                  user,
                );
                transaction = await this.createTransaction(entityManager, ticket, user); 
              }
            }

            if (ticket.status === TICKET_STATUS.AVAILABLE) {
              if (status == TICKET_STATUS.HOLD){
                await this.updateTicket(entityManager, ticket, ticketData, status);
                await this.deleteTransaction(
                  entityManager,
                  ticket,
                  TRANSACTION_SERVICE.Hold,
                  user,
                );
                transaction = await this.createTransaction(entityManager, ticket, user);
                ticket.holder = user;
                await entityManager.save(Ticket, ticket);
              }
              if (status == TICKET_STATUS.BOOKED || status == TICKET_STATUS.SOLD){
                throw new BadRequestException('You have to choose the tickets first');               
              }
            }
            return transaction;
          },
        ),
      );
    });
  }
}
