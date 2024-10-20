import { Request, Response } from 'express';
import * as invoiceRepository from '../repositories/invoiceRepository';
import fs from 'fs';

export const downloadInvoiceByClientAndMonth = async (req: Request, res: Response) => {
    try {

        const { clientNumber, referenceMonth } = req.query;
        if (!clientNumber || !referenceMonth) {
            res.status(400).send('Número do cliente e mês de referência são obrigatórios.');
            return;
        }

        const invoice = await invoiceRepository.getInvoices({
            clientNumber: String(clientNumber),
            referenceMonth: String(referenceMonth),
        });

        if (!invoice || invoice.length === 0) {
            res.status(404).send('Fatura não encontrada.');
            return;
        }

        const filePath = invoice[0].filePath;
        if (!fs.existsSync(filePath)) {
            res.status(404).send('Arquivo da fatura não encontrado.');
            return;
        }

        res.download(filePath);
    } catch (error) {
        res.status(500).send('Erro ao buscar fatura.');
    }
};
