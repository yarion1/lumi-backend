import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`);

    if (err.name === 'ValidationError') {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Erro interno no servidor.',
        });
    }
};

export default errorHandler;
