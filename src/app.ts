import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import invoiceRoutes from './routes/invoiceRoutes';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';

const prisma = new PrismaClient();
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
}));

app.use(express.json());
app.use('/api/invoices', invoiceRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
