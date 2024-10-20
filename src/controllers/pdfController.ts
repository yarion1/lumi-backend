import { Request, Response } from 'express';
import { addFilesToQueue } from '../services/pdfService';
import path from 'path';
import fs from 'fs';
import { generateFileHash } from '../services/pdfService';
import * as invoiceRepository from '../repositories/invoiceRepository';

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
    if (!req.files || !(req.files instanceof Array)) {
        res.status(400).send('Nenhum arquivo foi enviado.');
        return;
    }

    const files = req.files as Express.Multer.File[];
    const filesToProcess: string[] = [];
    const duplicateFiles: string[] = [];

    for (const file of files) {
        const filePath = file.path;
        const fileHash = generateFileHash(filePath);

        const existingInvoice = await invoiceRepository.getInvoices({ fileHash });

        if (existingInvoice.length > 0) {
            duplicateFiles.push(file.originalname);
        } else {
            filesToProcess.push(filePath);
        }
    }

    if (filesToProcess.length > 0) {
        addFilesToQueue(filesToProcess);
    }

    res.status(200).json({
        message: 'Arquivos processados.',
        uploaded: filesToProcess.map(filePath => path.basename(filePath)),
        duplicates: duplicateFiles
    });
};

export const processAllInvoices = (req: Request, res: Response): void => {
    const directoryPath = path.join(__dirname, '..', 'faturas');
    if (!fs.existsSync(directoryPath)) {
        res.status(404).send('Diretório não encontrado.');
        return;
    }

    const files = fs.readdirSync(directoryPath);
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf');
    addFilesToQueue(pdfFiles.map(file => path.join(directoryPath, file)));

    res.status(200).send('Todos os arquivos PDF foram adicionados à fila para processamento.');
};