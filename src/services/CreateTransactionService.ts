import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // Check if transaction.type it's income or outcome
    const transactionTypeValid = type === 'income' ? true : type === 'outcome';

    if (!transactionTypeValid) {
      throw new AppError('Transaction type not valid.');
    }

    if (type === 'outcome') {
      const balanceRepository = getCustomRepository(TransactionRepository);
      const balance = await balanceRepository.getBalance();
      const outcomeIsValid = balance.income - (balance.outcome + (value || 0));
      if (outcomeIsValid <= 0) {
        throw new AppError(
          "You don't have income resources for this outcome.",
          400,
        );
      }
    }

    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (checkCategoryExists) {
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: checkCategoryExists.id,
      });

      await transactionsRepository.save(transaction);
      return transaction;
    }

    const newCategory = await categoriesRepository.save({
      title: category,
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
