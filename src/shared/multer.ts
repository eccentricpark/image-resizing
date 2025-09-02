import multer from 'multer';
import { Request } from 'express';

function imageFilter (
  req: Request, 
  file: Express.Multer.File,
  cb: multer.FileFilterCallback){
    if(file.mimetype.startsWith('image/'))
      cb(null, true);
    else
      cb(null, false);
}

export const memoryOption = {
  options: {
    storage : multer.memoryStorage(),
    fileFilter: imageFilter,
    limits : {
      fileSize : 1024 * 1024 * 10
    }
  }
};

export const diskOption = {
  options: {
    storage: multer.diskStorage(
      {
        destination: './uploads',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }
    )
  }
};