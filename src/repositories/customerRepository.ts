import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCustomers = async () => {
    return await prisma.consumer.findMany();
};
