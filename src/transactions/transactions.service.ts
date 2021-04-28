import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Transaction } from './transactions.entity';

@Injectable()
export class TransactionsService extends BaseServiceCRUD<Transaction> {
    constructor(@InjectRepository(Transaction) repo) {
        super(repo,Transaction, "Transaction");
      }
}
