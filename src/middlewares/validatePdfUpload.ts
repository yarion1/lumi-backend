import { Request } from 'express';
import multer from 'multer';

const pdfUpload = multer({
    dest: 'faturas/',
    fileFilter: (req: Request, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PDF são permitidos.'));
        }
    },
});

export default pdfUpload;
