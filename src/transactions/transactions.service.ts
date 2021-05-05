import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
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
}
