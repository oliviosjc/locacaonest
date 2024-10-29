import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDTO } from "./dto/sign-in.dto";
import { BaseController } from "src/utils/base.controller";
import { ResponseViewModel } from "src/utils/response.model";
import { Response } from "express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { ConfirmAccountDTO } from "./dto/confirm-account.dto";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post("sign-in")
  @ApiOperation({ summary: "Realizar o login através de e-mail e senha" })
  async signIn(@Body() body: SignInDTO, @Res() res: Response): Promise<Response> {
    const response: ResponseViewModel<string>
      = await this.authService.signIn(body.email, body.password);

    return this.sendResponse(res, response);
  }

  @Post("create-account")
  @ApiOperation({ summary: "Criar uma conta" })
  async createAccount(@Body() body: CreateAccountDTO, @Res() res: Response): Promise<Response> {
    const response: ResponseViewModel<string>
      = await this.authService.createAccount(body);

    return this.sendResponse(res, response);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Realizar a recuperação de senha" })
  async forgotPassword(@Body() body: ForgotPasswordDTO, @Res() res: Response): Promise<Response> {
    const response: ResponseViewModel<string>
      = await this.authService.forgotpassword(body.email);

    return this.sendResponse(res, response);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Realizar o reset da senha" })
  async resetPassword(@Body() body: ResetPasswordDTO, @Res() res: Response): Promise<Response> {
    const response: ResponseViewModel<string>
      = await this.authService.resetPassword(body.token, body.password);

    return this.sendResponse(res, response);
  }

  @Post("confirm-account")
  @ApiOperation({ summary: "Confirmar a conta" })
  async confirmAccount(@Body() body: ConfirmAccountDTO, @Res() res: Response): Promise<Response> {
    const response: ResponseViewModel<string>
      = await this.authService.confirmAccount(body.token);

    return this.sendResponse(res, response);
  }
}
