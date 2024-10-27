import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/utils/base.controller';
import { CreateGroupCommand } from './commands/create-group.command';
import { ResponseViewModel } from 'src/utils/response.model';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateGroupCommand } from './commands/update-group.command';

@ApiTags('groups')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController extends BaseController
{
    constructor(private readonly commandBus: CommandBus)
    {
        super();
    }

    @Post()
    @ApiOperation({summary: 'Criar um novo grupo'})
    async createGroup(@Body() body: CreateGroupCommand, @Res() res: Response) : Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Patch()
    @ApiOperation({summary: 'Atualizar um grupo'})
    async updateGroup(@Body() body: UpdateGroupCommand, @Res() res: Response) : Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }
}
