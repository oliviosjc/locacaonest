import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BaseController } from 'src/utils/base.controller';
import { CreateBrandCommand } from './commands/brands/create-brand.command';
import { Response } from 'express';
import { ResponseViewModel } from 'src/utils/response.model';
import { CommandBus } from '@nestjs/cqrs';

@Controller('backoffice')
export class BackofficeController extends BaseController
{
    constructor(private readonly commandBus: CommandBus)
    {
        super();
    }

    @Post('brand')
    @ApiOperation({ summary: 'Criar uma nova marca' })
    async createBrand(@Body() body: CreateBrandCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }
}
