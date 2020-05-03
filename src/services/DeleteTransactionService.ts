import { getRepository, EntityRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

@EntityRepository(Transaction)
class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Repository not found', 404);
    }

    await transactionRepository.delete({
      id: transaction.id,
    });
  }
}

export default DeleteTransactionService;
