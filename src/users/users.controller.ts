import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserCommand } from './commands/create-user.command';
import { CommandBus } from '@nestjs/cqrs';
import { BaseController } from 'src/utils/base.controller';
import { ResponseViewModel } from 'src/utils/response.model';
import { Response } from 'express';

@ApiTags('users')
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
        const createUserCommand = new CreateUserCommand();
        Object.assign(createUserCommand, body); 
        
        const response: ResponseViewModel<string> = await this.commandBus.execute(createUserCommand);
        
        return this.sendResponse(res, response);
    }
}
