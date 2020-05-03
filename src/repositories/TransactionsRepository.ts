import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();

    const income = transactions
      .map(obj => {
        if (obj.type === 'income') {
          return obj.value;
        }
        return 0;
      })
      .reduce((current, total) => current + total, 0);

    const outcome = transactions
      .map(obj => {
        if (obj.type === 'outcome') {
          return obj.value;
        }
        return 0;
      })
      .reduce((current, total) => current + total, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
