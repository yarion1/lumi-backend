import { Request, Response } from 'express';
import * as customerRepository from '../repositories/customerRepository';

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await customerRepository.getCustomers();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).send('Erro ao buscar clientes.');
    }
};