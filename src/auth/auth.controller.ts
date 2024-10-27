import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { BaseController } from 'src/utils/base.controller';
import { ResponseViewModel } from 'src/utils/response.model';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController
{
    constructor(private authService: AuthService){
        super();
    }

    @Post('signIn')
    @ApiOperation({summary: 'Realizar o login através de e-mail e senha'})
    async signIn(@Body() body : SignInDTO, @Res() res: Response) : Promise<Response>
    {
        const dto = new SignInDTO();
        Object.assign(dto, body);

        const response : ResponseViewModel<string> = await this.authService.signIn(dto.email, dto.password);
        return this.sendResponse(res, response);
    }
}
