import { ServiceAnalysisQueryParams } from './dto/index';
import { QueryParams } from './../base/dto/query-params.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Ticket } from 'src/tickets/ticket.entity';
import { User } from 'src/users/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transactions.entity';
import { getManager } from 'typeorm';

@Injectable()
export class TransactionsService extends BaseServiceCRUD<Transaction> {
  constructor(@InjectRepository(Transaction) repo) {
    super(repo, Transaction, 'Transaction');
  }

  async createOne(createTransactionDto: CreateTransactionDto) {
    const { transaction_time, service, ticketId, userId } =
      createTransactionDto;
    const ticket = await Ticket.findOne(ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket not found!');
    }
    const user = await User.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const transaction = Transaction.create({
      transaction_time,
      service,
      ticket,
      user,
    });
    return transaction.save();
  }

  async getMyTransactions(
    query: QueryParams,
    userId: number,
  ): Promise<{ results: Transaction[]; total: number }> {
    const { relationsWith, filterByFields, perPage, page, orderBy } =
      await this.modifyQuery(query);

    const [results, total] = await getManager()
      .findAndCount(Transaction, {
        relations: relationsWith,
        where: {
          ...filterByFields,
          user: {
            id: userId,
          },
        },
        order: orderBy,
        take: perPage,
        skip: (page - 1) * perPage,
      })
      .catch((err) => {
        throw new InternalServerErrorException(`Failed due to ${err}`);
      });

    return {
      results,
      total,
    };
  }

  async serviceAnalysis(
    query: ServiceAnalysisQueryParams,
  ): Promise<{ buy: number; book: number; cancel: number }> {
    const year = query.year || new Date().getFullYear();

    return await getManager().query(`
      select service, count(service) as total
      FROM transaction
      WHERE date_part('year', transaction_time) = ${year}
      group by service
    `);
  }

  async saleAnalysis(
    query: ServiceAnalysisQueryParams,
  ): Promise<{ [k: string]: any }> {
    const year = query.year || new Date().getFullYear();

    return await getManager().query(`
      select to_char(transaction_time,'MM-YYYY') as month_year, sum(price) as "sumSales"
      FROM transaction
      WHERE date_part('year', transaction_time) = ${year}
      group by month_year
    `);
  }

  async movieAnalysis(): Promise<{ [k: string]: any }> {
    return await getManager().query(`
      Select (detail->'movie'->'name') as "movieName", count(*) as "buyQuantity"
      FROM transaction
      WHERE service = 'Buy'
      group by (detail->'movie'->'name')
    `);
  }
}
