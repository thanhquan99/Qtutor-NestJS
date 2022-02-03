import { ModelFields } from './../../db/models/BaseModel';
import { Transaction } from '../../db/models';
import { TransactionStatus } from '../../constant';

export const modifyTransaction = (
  transaction: Transaction,
  userId: string,
): ModelFields<Transaction> => {
  const isEdit =
    transaction.tutorUserId === userId &&
    transaction.status === TransactionStatus.UNPAID;
  const isCanPay =
    transaction.studentUserId === userId &&
    transaction.status === TransactionStatus.UNPAID;
  return { ...transaction, isEdit, isCanPay };
};
