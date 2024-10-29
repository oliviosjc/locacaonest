import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDTO } from "./dto/sign-in.dto";
import { BaseController } from "src/utils/base.controller";
import { ResponseViewModel } from "src/utils/response.model";
import { Response } from "express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAccountDTO } from "./dto/create-account.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post("sign-in")
  @ApiOperation({ summary: "Realizar o login através de e-mail e senha" })
  async signIn(@Body() body: SignInDTO, @Res() res: Response): Promise<Response> 
  {
    const response: ResponseViewModel<string>
      = await this.authService.signIn(body.email, body.password);

    return this.sendResponse(res, response);
  }

  @Post("create-account")
  @ApiOperation({ summary: "Criar uma conta" })
  async createAccount(@Body() body: CreateAccountDTO, @Res() res: Response): Promise<Response> 
  {
    const response: ResponseViewModel<string>
      = await this.authService.createAccount(body);

    return this.sendResponse(res, response);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Realizar a recuperação de senha" })
  async forgotPassword(@Body() email: string, @Res() res: Response): Promise<Response> 
  {
    const response: ResponseViewModel<string>
      = await this.authService.forgotpassword(email);

    return this.sendResponse(res, response);
  }
}
