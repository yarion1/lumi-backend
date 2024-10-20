import { extractInvoiceData } from '../../src/services/pdfService';
import path from 'path';

describe('PDF Parsing', () => {
    it('should correctly parse invoice data from PDF', async () => {

        const pdfPath = path.join(__dirname, '..', 'test-files', 'sample_invoice.pdf');

        const invoiceData = await extractInvoiceData(pdfPath);

        expect(invoiceData.clientNumber).toBe('7204076116');
        expect(invoiceData.referenceMonth).toBe('FEV/2024');
        expect(invoiceData.energyQuantity).toBe(50);
        expect(invoiceData.energyValue).toBeCloseTo(48.06);
        expect(invoiceData.sceeQuantity).toBe(250);
        expect(invoiceData.sceeValue).toBeCloseTo(128.21);

    });
});
