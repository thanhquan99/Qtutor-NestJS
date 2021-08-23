import { AnalysisQueryParams, TransactionQueryParams } from './dto/index';
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
import { getManager, Not } from 'typeorm';

@Injectable()
export class TransactionsService extends BaseServiceCRUD<Transaction> {
  constructor(@InjectRepository(Transaction) repo) {
    super(repo, Transaction, 'Transaction');
  }

  async getMany(
    query: TransactionQueryParams,
  ): Promise<{ results: Transaction[]; total: number }> {
    const { relationsWith, filterByFields, perPage, page, orderBy } =
      await this.modifyQuery(query);

    const [results, total] = await getManager()
      .findAndCount(Transaction, {
        relations: relationsWith,
        where: (qb) => {
          qb.where(filterByFields);
          qb.andWhere(`service != 'Draft'`);
          if (query.cinemaId) {
            qb.andWhere(`detail->'cinema'->>'id' = :cinemaId`, {
              cinemaId: query.cinemaId,
            });
          }
          if (query.movieId) {
            qb.andWhere(`detail->'movie'->>'id' = :movieId`, {
              movieId: query.movieId,
            });
          }
          if (query.startDate) {
            const startDate = new Date(`${query.startDate} 0:0 UTC`);
            qb.andWhere('transaction_time >= :startDate', {
              startDate: startDate.toUTCString(),
            });
          }
          if (query.endDate) {
            const endDate = new Date(`${query.endDate} 23:59 UTC`);
            qb.andWhere('transaction_time <= :endDate', {
              endDate: endDate.toUTCString(),
            });
          }
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
          service: Not('Draft'),
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
    query: AnalysisQueryParams,
  ): Promise<{ buy: number; book: number; cancel: number }> {
    let startDateQuery: string;
    if (query.startDate) {
      const startDate = new Date(`${query.startDate} 0:0 UTC`);
      startDateQuery = `AND transaction_time >= '${startDate.toUTCString()}'`;
    }

    let endDateQuery: string;
    if (query.endDate) {
      const endDate = new Date(`${query.endDate} 23:59 UTC`);
      endDateQuery = `AND transaction_time <= '${endDate.toUTCString()}'`;
    }

    return await getManager().query(`
      select service, count(service) as total
      FROM transaction
      WHERE service != 'Draft'
      ${startDateQuery ? startDateQuery : ''}
      ${endDateQuery ? endDateQuery : ''}
      group by service
    `);
  }

  async saleAnalysis(
    query: AnalysisQueryParams,
  ): Promise<{ [k: string]: any }> {
    let startDateQuery: string;
    if (query.startDate) {
      const startDate = new Date(`${query.startDate} 0:0 UTC`);
      startDateQuery = `AND transaction_time >= '${startDate.toUTCString()}'`;
    }

    let endDateQuery: string;
    if (query.endDate) {
      const endDate = new Date(`${query.endDate} 23:59 UTC`);
      endDateQuery = `AND transaction_time <= '${endDate.toUTCString()}'`;
    }

    return await getManager().query(`
      select to_char(transaction_time,'MM-YYYY') as month_year, sum(price) as "sumSales"
      FROM transaction
      WHERE service = 'Buy'
      ${startDateQuery ? startDateQuery : ''}
      ${endDateQuery ? endDateQuery : ''}
      group by month_year
    `);
  }

  async movieAnalysis(
    query: AnalysisQueryParams,
  ): Promise<{ [k: string]: any }> {
    let startDateQuery: string;
    if (query.startDate) {
      const startDate = new Date(`${query.startDate} 0:0 UTC`);
      startDateQuery = `AND transaction_time >= '${startDate.toUTCString()}'`;
    }

    let endDateQuery: string;
    if (query.endDate) {
      const endDate = new Date(`${query.endDate} 23:59 UTC`);
      endDateQuery = `AND transaction_time <= '${endDate.toUTCString()}'`;
    }

    return await getManager().query(`
      Select (detail->'movie'->'name') as "movieName", count(*) as "buyQuantity"
      FROM transaction
      WHERE service = 'Buy'
      ${startDateQuery ? startDateQuery : ''}
      ${endDateQuery ? endDateQuery : ''}
      group by (detail->'movie'->'name')
    `);
  }
}
