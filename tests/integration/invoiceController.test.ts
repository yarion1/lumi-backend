import request from 'supertest';
import express from 'express';
import invoiceRoutes from '../../src/routes/invoiceRoutes';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
app.use(express.json());
app.use('/api/invoices', invoiceRoutes);

const prisma = new PrismaClient();

describe('Invoice Upload and Retrieval', () => {
    let createdInvoiceId: number;

    afterAll(async () => {
        if (createdInvoiceId) {
            await prisma.invoice.delete({
                where: { id: createdInvoiceId }
            });
        }
        await prisma.$disconnect();
    });

    it('should upload a PDF and insert an invoice into the database', async () => {
        const pdfPath = path.join(__dirname, '..', 'test-files', 'sample_invoice.pdf');

        const response = await request(app)
            .post('/api/invoices/upload')
            .attach('files', pdfPath)
            .expect(200);

        const insertedInvoice = await prisma.invoice.findFirst({
            where: {
                clientNumber: '7204076116',
                referenceMonth: 'FEV/2024',
            }
        });

        expect(insertedInvoice).not.toBeNull();
        if (insertedInvoice) {
            createdInvoiceId = insertedInvoice.id;
            expect(insertedInvoice.clientNumber).toBe('7204076116');
            expect(insertedInvoice.referenceMonth).toBe('FEV/2024');
        }
    });

    it('should retrieve the inserted invoice by client number and reference month', async () => {
        expect(createdInvoiceId).not.toBeUndefined();

        const response = await request(app)
            .get(`/api/invoices?clientNumber=7204076116&referenceMonth=FEV/2024`)
            .expect(200);

        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].clientNumber).toBe('7204076116');
        expect(response.body[0].referenceMonth).toBe('FEV/2024');
    });
});
