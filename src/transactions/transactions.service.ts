import { QueryParams } from './../base/dto/query-params.dto';
import { Injectable } from '@nestjs/common';
import { BaseServiceCRUD } from '../base/base-service-CRUD';
import { Transaction } from '../db/models';

@Injectable()
export class TransactionsService extends BaseServiceCRUD<Transaction> {
  constructor() {
    super(Transaction, 'Transaction');
  }

  async getMe(
    userId: string,
    query: QueryParams,
  ): Promise<{ results: Transaction[]; total }> {
    const builder = Transaction.query()
      .modify('defaultSelect')
      .where((qs) => {
        qs.orWhere({ tutorUserId: userId }).orWhere({ studentUserId: userId });
      });

    return this.paginate(builder, query);
  }
}
