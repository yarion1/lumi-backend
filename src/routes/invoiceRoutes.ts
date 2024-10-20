import { Router } from 'express';
import { getInvoices, getInvoiceById, getDashboardData} from '../controllers/invoiceController';
import { uploadFiles, processAllInvoices } from '../controllers/pdfController';
import { downloadInvoiceByClientAndMonth } from '../controllers/downloadController';
import pdfUpload from '../middlewares/validatePdfUpload';
import { getCustomers} from '../controllers/customerController';

const router = Router();

router.get('/', getInvoices);
router.get('/unique:id', getInvoiceById);
router.get('/dashboard-data', getDashboardData);
router.get('/customers', getCustomers);

router.post('/upload', pdfUpload.array('files', 10), uploadFiles);
router.post('/process-all', processAllInvoices);

router.get('/download', downloadInvoiceByClientAndMonth);

export default router;
