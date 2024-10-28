import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserCommand } from './commands/create-user.command';
import { CommandBus } from '@nestjs/cqrs';
import { BaseController } from 'src/utils/base.controller';
import { ResponseViewModel } from 'src/utils/response.model';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddCompanyUserGroupCommand } from './commands/add-company-user-group.command';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController extends BaseController
{
    constructor(private readonly commandBus: CommandBus) {
        super();
    }
    
    @Post()
    @ApiOperation({summary: 'Criar um novo usuário na base de dados'})
    async createUser(@Body() body: CreateUserCommand, @Res() res: Response): Promise<Response> 
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('add-company-user-group')
    @ApiOperation({summary: 'Vincular um usuário existene a um grupo/empresa'})
    async addCompanyUserGroup(@Body() body: AddCompanyUserGroupCommand, @Res() res: Response): Promise<Response> 
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }
}
