import { ModelFields } from './../../db/models/BaseModel';
import { Transaction } from '../../db/models';
import request from 'request-promise';

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
    }).promise();

    const redirectUrl = res.links?.find((e) => e.method === 'REDIRECT')?.href;
    return redirectUrl;
  }

  async executePayment(paymentId: string, payerId: string): Promise<void> {
    const res = await request({
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
    }).promise();
    console.log(res);
  }
}

const paypalService = new PaypalService();
export default paypalService;
