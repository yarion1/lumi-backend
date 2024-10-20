import * as invoiceService from '../../src/services/invoiceService';
import * as invoiceRepository from '../../src/repositories/invoiceRepository';
import { InvoiceData } from '../../src/services/pdfService';

jest.mock('../../src/repositories/invoiceRepository');

describe('Dashboard Aggregation Calculation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly calculate aggregated values', async () => {
        const mockInvoices: InvoiceData[] = [
            {
                clientNumber: '1234567890',
                referenceMonth: 'JAN/2024',
                energyQuantity: 100,
                energyValue: 200,
                sceeQuantity: 50,
                sceeValue: 25,
                compensatedGD: 10,
                compensatedGDValue: 5,
                publicLightingFee: 15,
                filePath: '/path/to/pdf1.pdf',
                distributor: 'Distribuidor Exemplo',
                ucNumber: 'UC1234567890',
                fileHash: 'hash1234567890'
            },
            {
                clientNumber: '0987654321',
                referenceMonth: 'FEB/2024',
                energyQuantity: 200,
                energyValue: 400,
                sceeQuantity: 100,
                sceeValue: 50,
                compensatedGD: 20,
                compensatedGDValue: 10,
                publicLightingFee: 30,
                filePath: '/path/to/pdf2.pdf',
                distributor: 'Distribuidor Exemplo',
                ucNumber: 'UC0987654321',
                fileHash: 'hash0987654321'
            },
        ];

        (invoiceRepository.getInvoices as jest.Mock).mockResolvedValue(mockInvoices);

        const calculatedData = await invoiceService.calculateDashboardData({});

        expect(calculatedData.totalEnergyConsumed).toBe(450);
        expect(calculatedData.totalEnergyCompensated).toBe(30);
        expect(calculatedData.totalValueWithoutGD).toBe(720);
        expect(calculatedData.totalEconomyGD).toBe(15);
    });
});
