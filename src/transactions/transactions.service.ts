import { ModelFields } from './../db/models/BaseModel';
import { ExecutePaypalPaymentDto, UpdateTransactionDto } from './dto/index';
import { QueryParams } from './../base/dto/query-params.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseServiceCRUD } from '../base/base-service-CRUD';
import { Transaction } from '../db/models';
import { TransactionPayType, TransactionStatus } from '../constant';
import paypalService from '../service/paypal';

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

    const { results, total } = await this.paginate(builder, query);

    return {
      results: results.map((e: ModelFields<Transaction>): Transaction => {
        const isEdit = e.tutorUserId === userId;
        const isCanPay =
          e.studentUserId === userId && e.status === TransactionStatus.UNPAID;
        return { ...e, isEdit, isCanPay } as Transaction;
      }),
      total,
    };
  }

  async updateTransaction(
    id: string,
    payload: UpdateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const [transaction] = await Transaction.query()
      .where({ id })
      .andWhere((qs) => {
        qs.orWhere({ studentUserId: userId }).orWhere({ tutorUserId: userId });
      })
      .limit(1);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.tutorUserId === userId) {
      if (
        [TransactionPayType.CASH, TransactionPayType.TRANSFER].includes(
          payload.payType as TransactionPayType,
        )
      ) {
        await transaction.$query().patch({
          payType: payload.payType,
          status: TransactionStatus.PAID,
          modifiedBy: userId,
        });
      }
    }

    if (transaction.studentUserId === userId) {
      if (payload.payType === TransactionPayType.PAYPAL) {
        const paypalPaymentUrl = await paypalService.createPayment([
          transaction,
        ]);
        await transaction.$query().patch({
          payType: payload.payType,
          status: TransactionStatus.PENDING,
          modifiedBy: userId,
        });
        transaction.paypalPaymentUrl = paypalPaymentUrl;
      }
    }

    return transaction;
  }

  async executePayment(
    id: string,
    payload: ExecutePaypalPaymentDto,
    userId: string,
  ): Promise<Transaction> {
    const transaction = await Transaction.query().findOne({
      id,
      studentUserId: userId,
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await paypalService.executePayment(payload.paymentId, payload.payerId);
    await transaction.$query().patch({ status: TransactionStatus.PAID });
    return transaction;
  }
}
