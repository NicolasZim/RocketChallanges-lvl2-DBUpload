import { Router } from 'express';
import multer from 'multer';

import csvConfig from '../config/csv';

import CreateTransactionService from '../services/CreateTransactionService';
import ListTransactionService from '../services/ListTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const uploadCSV = multer(csvConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = new ListTransactionService();
  const transactions = await transactionsRepository.execute();

  return response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transacations = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transacations);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionsRepository = new DeleteTransactionService();
  await transactionsRepository.execute(id);
  response.send(200);
});

transactionsRouter.post(
  '/import',
  uploadCSV.single('file'),
  async (request, response) => {
    const { filename } = request.file;
    const transactionsRepository = new ImportTransactionsService();
    const transactions = await transactionsRepository.execute(filename);

    response.json(transactions);
  },
);

export default transactionsRouter;
