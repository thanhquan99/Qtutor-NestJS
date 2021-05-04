import { EntityRepository, Repository } from "typeorm";
import { Transaction } from "./transactions.entity";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {}