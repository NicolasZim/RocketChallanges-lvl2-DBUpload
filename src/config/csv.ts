import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

import AppError from '../errors/AppError';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const ext = path.extname(file.originalname);
      if (ext !== '.csv') {
        throw new AppError('Only CSV files are allowed');
      }

      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
