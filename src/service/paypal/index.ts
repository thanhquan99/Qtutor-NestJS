import { ModelFields } from './../../db/models/BaseModel';
import { Transaction } from '../../db/models';
import request from 'request-promise';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { DEFAULT_EMAIL, TransactionStatus } from '../../constant';

class PaypalService {
  readonly clientId: string;
  readonly clientSecret: string;

  constructor() {
    this.clientId =
      'AVKOBXuI1QAwoWtJPqRxIendBptk7_nUFkc3EHpJeSfB35XavGWma1sf1AS_81lw5rpY5hYXWeBB5Jl7';
    this.clientSecret =
      'EMBe4TonElT4gg14_bCRKfYQ6L5TgkJuVWzpaSo2pkaQ-wgbaxd8pwb_OMYN6zM_jaPkBNxIrQpatHBF';
  }

  async createPayment(
    transactions: ModelFields<Transaction>[],
  ): Promise<string> {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'https://qtutor-web-client.herokuapp.com/transactions',
        cancel_url: 'https://qtutor-web-client.herokuapp.com/transactions',
      },
      transactions: [
        {
          item_list: {
            items: transactions.map((e) => ({
              name: `${e.subject?.name} - ${e.tutorUser?.profile?.name}`,
              sku: 'Tuition fee',
              price: (e.price / 20000).toString(),
              currency: 'USD',
              quantity: 1,
            })),
          },
          amount: {
            currency: 'USD',
            total: (
              transactions.reduce((a, b) => a + b.price, 0) / 20000
            ).toString(),
          },
          description: 'This is the tuition fee payment',
        },
      ],
    };

    const res = await request({
      method: 'post',
      uri: 'https://api-m.sandbox.paypal.com/v1/payments/payment',
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
      body: create_payment_json,
      json: true,
    })
      .promise()
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    const redirectUrl = res.links?.find((e) => e.method === 'REDIRECT')?.href;
    return redirectUrl;
  }

  async executePayment(paymentId: string, payerId: string): Promise<void> {
    await request({
      method: 'post',
      uri: `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
      body: {
        payer_id: payerId,
      },
      json: true,
    })
      .promise()
      .catch((err) => {
        throw new BadRequestException(err);
      });
  }

  async createPayout(
    transactions: ModelFields<Transaction>[],
    receiverEmail: string,
    mailService?: MailerService,
  ) {
    const message = transactions
      .map(
        (e) => `${e.subject?.name} - Student ${e.studentUser?.profile?.name}`,
      )
      .join(',');
    const payoutBody = {
      sender_batch_header: {
        sender_batch_id: transactions[0].id,
        recipient_type: 'EMAIL',
        email_subject: 'You have money!',
        email_message: `You received your tuition payment. ${message}`,
      },
      items: [
        {
          amount: {
            value: (
              transactions.reduce((a, b) => a + b.price, 0) / 20000
            ).toString(),
            currency: 'USD',
          },
          recipient_wallet: 'PAYPAL',
          receiver: receiverEmail,
        },
      ],
    };
    await request({
      method: 'post',
      uri: 'https://api.sandbox.paypal.com/v1/payments/payouts',
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
      body: payoutBody,
      json: true,
    })
      .promise()
      .catch(async (err) => {
        await mailService.sendMail({
          to: DEFAULT_EMAIL,
          subject: 'Paypal Announcement',
          html: 'Your paypal email is not correct. Please update your paypal email', // HTML body content
        });
        throw new BadRequestException(err);
      });

    await Transaction.query()
      .whereIn(
        'id',
        transactions.map((e) => e.id),
      )
      .update({ status: TransactionStatus.PAID });
  }
}

const paypalService = new PaypalService();
export default paypalService;
