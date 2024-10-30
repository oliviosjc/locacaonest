import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../utils/base.controller';
import { CreateGroupCommand } from './commands/create-group.command';
import { ResponseViewModel } from '../utils/response.model';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateGroupCommand } from './commands/update-group.command';
import { AddGroupMenuItemFeatureCommand } from './commands/add-group-menu-item-feature.command';
import { RemoveGroupMenuItemFeatureCommand } from './commands/remove-group-menu-item-feature.command';

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

    @Post('add-group-menu-item-feature')
    @ApiOperation({summary: 'Adicionar uma feature de um item de menu a um grupo'})
    async addGroupMenuItemFeature(@Body() body: AddGroupMenuItemFeatureCommand, @Res() res: Response) : Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }

    @Post('remove-group-menu-item-feature')
    @ApiOperation({summary: 'Remover uma feature de um item de menu de um grupo'})
    async removeGroupMenuItemFeature(@Body() body: RemoveGroupMenuItemFeatureCommand, @Res() res: Response) : Promise<Response>
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }
}
