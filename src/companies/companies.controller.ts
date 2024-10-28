import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { BaseController } from 'src/utils/base.controller';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { CreateCompanyCommand } from './commands/create-company.command';
import { ResponseViewModel } from 'src/utils/response.model';

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
    async createUser(@Body() body: CreateCompanyCommand, @Res() res: Response): Promise<Response> 
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }
}
