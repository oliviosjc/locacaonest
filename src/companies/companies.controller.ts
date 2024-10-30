import { Body, Controller, Get, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { BaseController } from '../utils/base.controller';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { CreateCompanyCommand } from './commands/create-company.command';
import { ResponseViewModel } from '../utils/response.model';
import { UpdateCompanyCommand } from './commands/update-company.command';
import { GetMyCompaniesDTO } from './dtos/get-my-companies.dto';
import { GetMyCompaniesQuery } from './queries/get-my-companies.query';

@ApiTags('companies')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('companies')
export class CompaniesController extends BaseController
{
    constructor(private readonly commandBus: CommandBus)
    {
        super();
    }

    @Post()
    @ApiOperation({summary: 'Criar uma nova empresa na base de dados'})
    async createCompany(@Body() body: CreateCompanyCommand, @Res() res: Response): Promise<Response> 
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Put()
    @ApiOperation({summary: 'Atualizar dados de uma empresa na base de dados'})
    async updateCompany(@Body() body: UpdateCompanyCommand, @Res() res: Response) : Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Get('mine')
    @ApiOperation({summary: 'Listar as empresas que o usuário tem acesso'})
    async getCompanies(@Res() res: Response): Promise<Response>
    {
        const response: ResponseViewModel<GetMyCompaniesDTO[]> 
        = await this.commandBus.execute(new GetMyCompaniesQuery());

        return this.sendResponse(res, response);
    }
}
