import { Response } from 'express';
import { ResponseViewModel } from './response.model';

export abstract class BaseController {
    protected sendResponse<T>(res: Response, response: ResponseViewModel<T>): Response 
    {
        const statusCode: number = typeof response.statusCode === 'number'
            ? response.statusCode
            : 500;

        return res.status(statusCode).json(response);
    }
}