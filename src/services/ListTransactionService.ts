import {
  EntityRepository,
  Repository,
  getRepository,
  getCustomRepository,
} from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Transactions {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: {
    id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
  };
  created_at: Date;
  updated_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsResponse {
  transactions: Transactions[];
  balance: Balance;
}

@EntityRepository(Transaction)
class ListTransactionService extends Repository<Transaction> {
  public async execute(): Promise<TransactionsResponse> {
    const transactionsRepository = getRepository(Transaction);
    const transactionsRequest = await transactionsRepository.find();
    const categoryTransaction = getRepository(Category);
    const categories = await categoryTransaction.find();

    const transactions = transactionsRequest.map(object => {
      const categoryObject = categories.filter(
        category => category.id === object.category_id,
      );
      return {
        id: object.id,
        title: object.title,
        value: object.value,
        type: object.type,
        category: {
          id: object.category_id,
          title: categoryObject[0].title,
          created_at: categoryObject[0].created_at,
          updated_at: categoryObject[0].updated_at,
        },
        created_at: object.created_at,
        updated_at: object.updated_at,
      };
    });

    const balanceRepository = getCustomRepository(TransactionRepository);
    const balance = await balanceRepository.getBalance();

    return { transactions, balance };
  }
}

export default ListTransactionService;
