import { Body, Controller, Post, Put, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BaseController } from '../utils/base.controller';
import { CreateBrandCommand } from './commands/brands/create-brand.command';
import { Response } from 'express';
import { ResponseViewModel } from '../utils/response.model';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './commands/categories/create-category.command';
import { CreateModelCommand } from './commands/models/create-model.command';
import { CreateCustomerCommand } from './commands/customers/create-customer.command';
import { CreateCustomerAddressCommand } from './commands/customers/addresses/create-customer-address.command';
import { UpdateCustomerContactCommand } from './commands/customers/contacts/update-customer-contact.command';
import { CreateCustomerDocumentConfigurationCommand } from './commands/customers/documents/create-customer-document-configuration.command';
import { DeleteCustomerContactCommand } from './commands/customers/contacts/delete-customer-contact.command';

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

    @Post('category')
    @ApiOperation({ summary: 'Criar uma nova categoria' })
    async createCategory(@Body() body: CreateCategoryCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('model')
    @ApiOperation({ summary: 'Criar um novo modelo' })
    async createModel(@Body() body: CreateModelCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('customer')
    @ApiOperation({ summary: 'Criar um novo cliente' })
    async createCustomer(@Body() body: CreateCustomerCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('customer/add-address')
    @ApiOperation({ summary: 'Adicionar um novo endereço ao cliente' }) 
    async addCustomerAddress(@Body() body: CreateCustomerAddressCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('customer/add-contact')
    @ApiOperation({ summary: 'Adicionar um novo contato ao cliente' }) 
    async addCustomerContact(@Body() body: CreateCustomerAddressCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Put('customer/update-contact')
    @ApiOperation({ summary: 'Atualizar um contato de um cliente' }) 
    async updateCustomerDocumentContact(@Body() body: UpdateCustomerContactCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('customer/delete-contact')
    @ApiOperation({ summary: 'Excluir um contato de um cliente' }) 
    async deleteCustomerDocumentContact(@Body() body: DeleteCustomerContactCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('customer/document/configuration')
    @ApiOperation({ summary: 'Criar uma nova configuração de documento' }) 
    async createCustomerDocumentConfiguration(@Body() body: CreateCustomerDocumentConfigurationCommand, @Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }
}
