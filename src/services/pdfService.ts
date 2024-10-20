import fs from 'fs';
import pdfParse from 'pdf-parse';
import crypto from 'crypto';
import Queue, { Job } from 'bull';
import * as invoiceRepository from '../repositories/invoiceRepository';

export interface InvoiceData {
    clientNumber: string;
    referenceMonth: string;
    energyQuantity: number;
    energyValue: number;
    sceeQuantity: number;
    sceeValue: number;
    compensatedGD: number;
    compensatedGDValue: number;
    publicLightingFee: number;
    filePath: string;
    distributor: string;
    ucNumber: string;
    fileHash: string;
}

const parseNumber = (value: string | undefined): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
};

export const generateFileHash = (filePath: string): string => {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
};

const extractClientNumber = (lines: string[]): string => {
    for (const line of lines) {
        if (line.includes('Nº DO CLIENTE')) {
            const nextLineIndex = lines.indexOf(line) + 1;
            if (nextLineIndex < lines.length) {
                const match = lines[nextLineIndex].match(/(\d{10})/);
                if (match) {
                    return match[1];
                }
            }
        }
    }
    return '';
};

const extractReferenceMonth = (lines: string[]): string => {
    for (const line of lines) {
        if (line.includes('Referente a')) {
            const nextLineIndex = lines.indexOf(line) + 1;
            if (nextLineIndex < lines.length) {
                const match = lines[nextLineIndex].match(/([A-Z]{3}\/\d{4})/i);
                if (match) {
                    return match[1];
                }
            }
        }
    }
    return '';
};

const extractEnergyQuantity = (lines: string[]): number => {
    for (const line of lines) {
        const match = line.match(/Energia ElétricakWh\s+(\d+(\.\d+)?)/);
        if (match) {
            return parseNumber(match[1]);
        }
    }
    return 0;
};

const extractEnergyValue = (lines: string[]): number => {
    for (const line of lines) {
        const match = line.match(/Energia ElétricakWh\s+\d+\s+\S+\s+([\d.,]+)/);
        if (match) {
            return parseNumber(match[1]);
        }
    }
    return 0;
};

const extractSceeQuantity = (lines: string[]): number => {
    for (const line of lines) {
        const match = line.match(/Energia SCEE s\/ ICMSkWh\s+(\d+(\.\d+)?)/);
        if (match) {
            return parseNumber(match[1]);
        }
    }
    return 0;
};

const extractSceeValue = (lines: string[]): number => {
    for (const line of lines) {
        const match = line.match(/Energia SCEE s\/ ICMSkWh\s+\d+(\.\d+)?\s+\S+\s+([\d.,]+)/);
        if (match) {
            return parseNumber(match[2]);
        }
    }
    return 0;
};

const extractCompensatedGD = (lines: string[]): number => {
    for (const line of lines) {
        const match = line.match(/Energia compensada GD IkWh\s+(\d+(\.\d+)?)/);
        if (match) {
            return parseNumber(match[1]);
        }
    }
    return 0;
};

const extractCompensatedGDValue = (lines: string[]): number => {
    for (const line of lines) {
        const match = line.match(/Energia compensada GD IkWh\s+\d+(\.\d+)?\s+\S+\s+(\-?[\d.,]+)/);
        if (match) {
            return parseNumber(match[2]);
        }
    }
    return 0;
};

const extractPublicLightingFee = (lines: string[]): number => {
    for (const line of lines) {
        const match = line.match(/Contrib Ilum Publica Municipal\s+([\d.,]+)/);
        if (match) {
            return parseNumber(match[1]);
        }
    }
    return 0;
};

const extractUcNumber = (lines: string[]): string => {
    for (const line of lines) {
        if (line.includes('Nº DO CLIENTE')) {
            const nextLineIndex = lines.indexOf(line) + 1;
            if (nextLineIndex < lines.length) {
                const match = lines[nextLineIndex].match(/\d{10}\s+(\d{10})/);
                if (match) {
                    return match[1];
                }
            }
        }
    }
    return '';
};

const extractDistributor = (lines: string[]): string => {
    for (const line of lines) {
        if (line.includes('CEMIG DISTRIBUIÇÃO S.A')) {
            return 'CEMIG DISTRIBUIÇÃO S.A';
        }
    }
    return '';
};

export const extractInvoiceData = async (filePath: string): Promise<InvoiceData> => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    const lines = text.split('\n').map(line => line.trim());

    return {
        clientNumber: extractClientNumber(lines),
        referenceMonth: extractReferenceMonth(lines),
        energyQuantity: extractEnergyQuantity(lines),
        energyValue: extractEnergyValue(lines),
        sceeQuantity: extractSceeQuantity(lines),
        sceeValue: extractSceeValue(lines),
        compensatedGD: extractCompensatedGD(lines),
        compensatedGDValue: extractCompensatedGDValue(lines),
        publicLightingFee: extractPublicLightingFee(lines),
        filePath: filePath,
        distributor: extractDistributor(lines),
        ucNumber: extractUcNumber(lines),
        fileHash: generateFileHash(filePath),
    };
};

export const processSingleInvoice = async (filePath: string) => {
    try {
        const fileHash = generateFileHash(filePath);

        const existingInvoice = await invoiceRepository.getInvoices({ fileHash });

        if (existingInvoice.length > 0) {
            console.log(`O arquivo ${filePath} já foi processado anteriormente.`);
            return;
        }

        const invoiceData = await extractInvoiceData(filePath);

        let consumer = await invoiceRepository.getConsumerByClientNumber(invoiceData.clientNumber);

        if (!consumer) {
            consumer = await invoiceRepository.createConsumer({
                ucNumber: invoiceData.ucNumber,
                clientNumber: invoiceData.clientNumber,
            });
        }

        try {
            await invoiceRepository.createInvoice({
                ...invoiceData,
                consumerId: consumer.id,
            });
        } catch (error) {
            console.error('Erro ao inserir a fatura no banco de dados:', error);
        }

    } catch (error) {

    }
};

const invoiceQueue = new Queue('invoiceQueue', {
    redis: {
        host: 'redis',
        port: 6379,
        maxRetriesPerRequest: 10,
    },
});

invoiceQueue.process(async (job: Job<{ filePath: string }>) => {
    const { filePath } = job.data;
    await processSingleInvoice(filePath);
});

export const addFilesToQueue = (files: string[]) => {
    files.forEach((filePath) => {
        invoiceQueue.add({ filePath });
    });
};
