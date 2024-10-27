import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { BaseController } from 'src/utils/base.controller';
import { ResponseViewModel } from 'src/utils/response.model';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Realizar o login através de e-mail e senha' })
  async signIn(
    @Body() body: SignInDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const response: ResponseViewModel<string> = await this.authService.signIn(
      body.email,
      body.password,
    );
    return this.sendResponse(res, response);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Busca informações do token logado' })
  getProfile(@Request() req) {
    return req.user;
  }
}
