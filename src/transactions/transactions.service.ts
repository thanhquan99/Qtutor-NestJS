import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Ticket } from 'src/tickets/ticket.entity';
import { User } from 'src/users/user.entity';
import { Entity, TransactionRepository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transactions.entity';

@Injectable()
export class TransactionsService extends BaseServiceCRUD<Transaction> {
    constructor(@InjectRepository(Transaction) repo) {
        super(repo,Transaction, "Transaction");
      }
      async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const transaction = Transaction.create(createTransactionDto)
        await transaction.save();
        return transaction;
      }
      async deleteTransactionById(id: number){
        await Transaction.delete(id);
      }
      async updateTransactionById(id: number, transaction_time:Date, service:string){
        const transaction = Transaction.findByIds([id]);
        ;
      }
      async createOne(createTransactionDto: CreateTransactionDto){
        const {transaction_time, service, ticketId, userId} = createTransactionDto;
        const ticket = await Ticket.findOne(ticketId);
        if (!ticket){
            throw new NotFoundException("Ticket not found!");
        }
        const user = await User.findOne(userId);
        if (!user){
            throw new NotFoundException("User not found!");
        }
        const transaction = Transaction.create({transaction_time, service, ticket, user});
        return transaction.save();
    }
}