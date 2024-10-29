import { Body, Controller, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/utils/base.controller';
import { CreateAccountCommand } from './commands/create-account.command';
import { ResponseViewModel } from 'src/utils/response.model';
import { Response } from 'express';

@ApiTags('onboarding')
@Controller('onboarding')
export class OnboardingController extends BaseController 
{
    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    @Post('create-account')
    async createAccount(@Body() body: CreateAccountCommand,  @Res() res: Response): Promise<ResponseViewModel<string>> 
    {
        const response: ResponseViewModel<string> = await this.commandBus.execute(body);
        return this.sendResponse(res, response);
    }
}
