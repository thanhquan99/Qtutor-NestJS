import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseServiceCRUD } from '../base/base-service-CRUD';
import {
  DEFAULT_EMAIL,
  TransactionPayType,
  TransactionStatus,
} from '../constant';
import { Transaction, User } from '../db/models';
import paypalService from '../service/paypal';
import { QueryParams } from './../base/dto/query-params.dto';
import { ModelFields } from './../db/models/BaseModel';
import {
  CreatePaypalPaymentDto,
  ExecutePaypalPaymentDto,
  UpdateTransactionDto,
} from './dto/index';
import { modifyTransaction } from './helper';

@Injectable()
export class TransactionsService extends BaseServiceCRUD<Transaction> {
  constructor(private readonly mailerService: MailerService) {
    super(Transaction, 'Transaction');
  }

  async getMe(
    userId: string,
    query: QueryParams,
  ): Promise<{ results: Transaction[]; total }> {
    const builder = Transaction.queryBuilder(query)
      .modify('defaultSelect')
      .where((qs) => {
        qs.orWhere({ tutorUserId: userId }).orWhere({ studentUserId: userId });
      });

    const { results, total } = await this.paginate(builder, query);

    return {
      results: results.map((e: ModelFields<Transaction>): Transaction => {
        const isEdit =
          e.tutorUserId === userId && e.status === TransactionStatus.UNPAID;
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
  ): Promise<ModelFields<Transaction>> {
    const transaction = await Transaction.query()
      .modify('defaultSelect')
      .findOne({
        id,
        tutorUserId: userId,
      });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.status !== TransactionStatus.UNPAID) {
      throw new BadRequestException('Can not update this transaction');
    }

    await transaction.$query().patch({
      payType: payload.payType,
      status: TransactionStatus.PAID,
      modifiedBy: userId,
    });

    return modifyTransaction(transaction, userId);
  }

  async createPayment(
    id: string,
    payload: CreatePaypalPaymentDto,
    userId: string,
  ): Promise<{ paypalPaymentUrl: string }> {
    const transaction = await Transaction.query()
      .modify('defaultSelect')
      .findOne({
        id,
        studentUserId: userId,
      });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.status !== TransactionStatus.UNPAID) {
      throw new BadRequestException('This transaction is not unpaid');
    }

    const paypalPaymentUrl = await paypalService.createPayment([transaction], {
      returnUrl: payload.returnUrl,
      cancelUrl: payload.cancelUrl,
    });

    await transaction.$query().patch({
      payType: TransactionPayType.PAYPAL,
      status: TransactionStatus.PENDING,
      modifiedBy: userId,
    });
    return { paypalPaymentUrl };
  }

  async executePayment(
    id: string,
    payload: ExecutePaypalPaymentDto,
    userId: string,
  ): Promise<ModelFields<Transaction>> {
    const transaction = await Transaction.query()
      .modify('defaultSelect')
      .findOne({
        id,
        studentUserId: userId,
      });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Only pending transaction can execute');
    }

    await paypalService.executePayment(payload.paymentId, payload.payerId);

    const tutorUser = await User.query().findById(transaction.tutorUserId);
    if (tutorUser.paypalEmail) {
      await paypalService.createPayout(
        [transaction],
        tutorUser.paypalEmail,
        this.mailerService,
      );
    } else {
      await this.mailerService.sendMail({
        to: DEFAULT_EMAIL,
        subject: 'Paypal Announcement',
        html: 'You have a tuition payment. Please update your paypal email', // HTML body content
      });
    }

    return modifyTransaction(transaction, userId);
  }

  async getMySummary(userId: string): Promise<{ totalUnpaidCount: string }> {
    const { count: totalUnpaidCount } = await Transaction.query()
      .where({
        status: TransactionStatus.UNPAID,
      })
      .andWhere((qb) => {
        qb.orWhere({ tutorUserId: userId }).orWhere({ studentUserId: userId });
      })
      .count()
      .first();
    return { totalUnpaidCount };
  }
}
