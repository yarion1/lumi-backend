import { Request, Response } from 'express';
import * as invoiceRepository from '../repositories/invoiceRepository';
import * as invoiceService from '../services/invoiceService';

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clientNumber, referenceMonth } = req.query;

        const filters: { clientNumber?: string; referenceMonth?: any } = {};

        if (clientNumber) {
            filters.clientNumber = String(clientNumber);
        }

        if (referenceMonth) {
            const referenceMonthStr = String(referenceMonth);

            // Verifica se referenceMonth é um ano (apenas números, ex: 2022)
            if (/^\d{4}$/.test(referenceMonthStr)) {
                // Se for um ano, aplica o filtro para todos os meses do ano
                filters.referenceMonth = {
                    contains: referenceMonthStr, // Procura qualquer mês do ano fornecido
                };
            } else if (/^[A-Z]{3}\/\d{4}$/i.test(referenceMonthStr)) {
                // Se for no formato MAR/2024, aplica o filtro exato
                filters.referenceMonth = referenceMonthStr;
            } else {
                res.status(400).json({ message: 'Formato de referenceMonth inválido. Use o formato MMM/YYYY ou YYYY.' });
                return;
            }
        }

        const invoices = await invoiceRepository.getInvoices(filters);

        if (invoices.length === 0) {
            res.status(404).json({ message: 'Nenhuma fatura encontrada com os filtros fornecidos.' });
            return;
        }

        res.status(200).json(invoices);
    } catch (error) {
        console.error('Erro ao buscar faturas:', error);
        res.status(500).send('Erro ao buscar faturas.');
    }
};

export const getInvoiceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const invoiceId = parseInt(id, 10);
        if (isNaN(invoiceId)) {
            res.status(400).send('ID inválido.');
            return;
        }

        const invoice = await invoiceRepository.getInvoiceById(invoiceId);

        if (!invoice) {
            res.status(404).send('Fatura não encontrada.');
            return;
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).send('Erro ao buscar fatura.');
    }
};

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const { clientNumber, referenceMonth } = req.query;

        const filters: { clientNumber?: string; referenceMonth?: any } = {};

        if (clientNumber) {
            filters.clientNumber = String(clientNumber);
        }

        if (referenceMonth) {
            const referenceMonthStr = String(referenceMonth);

            if (/^\d{4}$/.test(referenceMonthStr)) {
                filters.referenceMonth = {
                    contains: referenceMonthStr,
                };
            } else if (/^[A-Z]{3}\/\d{4}$/i.test(referenceMonthStr)) {
                filters.referenceMonth = referenceMonthStr;
            } else {
                res.status(400).json({ message: 'Formato de referenceMonth inválido. Use o formato MMM/YYYY ou YYYY.' });
                return;
            }
        }

        const dashboardData = await invoiceService.calculateDashboardData(
        filters);

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        res.status(500).send('Erro ao buscar dados do dashboard.');
    }
};