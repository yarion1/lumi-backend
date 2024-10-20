import { PrismaClient} from '@prisma/client';
import { InvoiceData } from '../services/pdfService';

const prisma = new PrismaClient();

export const getInvoices = async (filters: { clientNumber?: string; referenceMonth?: string; filePath?: string; fileHash?: string }) => {
    return await prisma.invoice.findMany({
        where: filters,
    });
};

export const getInvoiceById = async (id: number) => {
    return await prisma.invoice.findUnique({
        where: { id },
    });
};

export const getConsumerByClientNumber = async (clientNumber: string) => {
    return await prisma.consumer.findUnique({
        where: {
            clientNumber,
        },
    });
};

export const createConsumer = async (consumerData: { ucNumber: string; clientNumber: string }) => {
    return await prisma.consumer.create({
        data: consumerData,
    });
};

export const createInvoice = async (invoiceData: InvoiceData & { consumerId: number }) => {
    return await prisma.invoice.create({
        data: {
            clientNumber: invoiceData.clientNumber,
            referenceMonth: invoiceData.referenceMonth,
            energyQuantity: invoiceData.energyQuantity,
            energyValue: invoiceData.energyValue,
            sceeQuantity: invoiceData.sceeQuantity,
            sceeValue: invoiceData.sceeValue,
            compensatedGD: invoiceData.compensatedGD,
            compensatedGDValue: invoiceData.compensatedGDValue,
            publicLightingFee: invoiceData.publicLightingFee,
            filePath: invoiceData.filePath,
            distributor: invoiceData.distributor,
            fileHash: invoiceData.fileHash,
            consumer: {
                connect: { id: invoiceData.consumerId },
            },
        },
    });
};
