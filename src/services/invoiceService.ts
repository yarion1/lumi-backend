import { Invoice } from '@prisma/client';
import * as invoiceRepository from '../repositories/invoiceRepository';

interface Filters {
    clientNumber?: string;
    referenceMonth?: string;
}

export const calculateDashboardData = async (filters: Filters) => {

    const invoices = await invoiceRepository.getInvoices(filters);

    const totalEnergyConsumed = invoices.reduce((sum: number, invoice: Invoice) => {
        return sum + (invoice.energyQuantity || 0) + (invoice.sceeQuantity || 0);
    }, 0);

    const totalEnergyCompensated = invoices.reduce((sum: number, invoice: Invoice) => {
        return sum + (invoice.compensatedGD || 0);
    }, 0);

    const totalValueWithoutGD = invoices.reduce((sum: number, invoice: Invoice) => {
        return sum + (invoice.energyValue || 0) + (invoice.sceeValue || 0) + (invoice.publicLightingFee || 0);
    }, 0);

    const totalEconomyGD = invoices.reduce((sum: number, invoice: Invoice) => {
        return sum + (invoice.compensatedGDValue || 0);
    }, 0);

    return {
        totalEnergyConsumed,
        totalEnergyCompensated,
        totalValueWithoutGD,
        totalEconomyGD,
    };
};
