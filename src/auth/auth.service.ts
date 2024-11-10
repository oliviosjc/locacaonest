import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { IDataService } from "../database/repositories/interfaces/data-service.interface";
import { ResponseViewModel } from "../utils/response.model";
import { JwtService } from "@nestjs/jwt";
import { UserDTO } from "./dto/user.dto";
import { ClsService } from "nestjs-cls";
import { UserStatus } from "../users/enumerators/user-status.enumerator";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { DocumentHelper } from "../utils/document.helper";
import { compare, hash } from 'bcrypt';
import { EmailService } from "../email/email.service";
import { Company } from "src/companies/entities/company.entity";
import { Group } from "src/groups/entities/group.entity";
import { CompanyUserGroup } from "src/companies/entities/company-user-group.entity";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(private readonly dataService: IDataService,
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
    private readonly emailService: EmailService
  ) { }

  async signIn(email: string, password: string): Promise<ResponseViewModel<string>> 
  {
    const user
      = await this.dataService.users.findOne({ where: { email: email }, 
        relations: ["owner", "companyUserGroups.company", "companyUserGroups.group"] });

    if (user.status === UserStatus.BLOCKED)
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O usuário vinculado a este e-mail está bloqueado!');

    if (user.status === UserStatus.WAITING_EMAIL_VERIFICATION)
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O usuário vinculado a este e-mail ainda não foi verificado!');

    if (user && (await compare(password, user.password))) 
    {
      const { password, ...result } = user;
      const payload =
      {
        email: result.email,
        sub: result.id,
        ownerId: result.owner ? result.owner.id : null,
        status: result.status,
        company: 
        {
          id: user.companyUserGroups[0].company.id,
          name: user.companyUserGroups[0].company.socialName
        },
        group: 
        {
          id: user.companyUserGroups[0].group.id,
          name: user.companyUserGroups[0].group.name
        },
        menu: null
      };

      return new ResponseViewModel<string>(HttpStatus.OK, "Login efetuado com sucesso!", this.jwtService.sign(payload));
    }
    else
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, "Email ou senha inválidos!");
  }

  async forgotpassword(email: string): Promise<ResponseViewModel<string>> {
    const user
      = await this.dataService.users.findOne({ where: { email: email } });

    if (!user)
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, "Nenhum usuário encontrado com este e-mail.");

    if (user.status === UserStatus.BLOCKED)
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O usuário vinculado a este e-mail está bloqueado!');

    if (user.status === UserStatus.WAITING_EMAIL_VERIFICATION) {
      const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '12h' });
      const resetLink = `http://seuapp.com/confirm-account?token=${token}`; 

      this.emailService.addEmailToQueue({
        to: user.email,
        subject: 'Confirmar minha conta',
        text: `Clique no link abaixo para confirmar sua nova conta: ${resetLink}`
      });

      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST,
        'O e-mail informado a confirmação por e-mail. Não esqueça de verificar a caixa de spam!');
    }

    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '1h' });
    const resetLink = `http://seuapp.com/reset-password?token=${token}`;

    await this.emailService.addEmailToQueue({
      to: user.email,
      subject: 'Recuperação de senha',
      text: `Clique no link abaixo para alterar sua senha: ${resetLink}`,
    });

    return new ResponseViewModel<string>(HttpStatus.OK, 'O link para alteração de senha foi enviado em seu e-mail.');
  }

  async resetPassword(token: string, password: string): Promise<ResponseViewModel<string>> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.dataService.users.findOne({ where: { id: payload.userId } });

      const hashedPassword = await hash(password, 12);

      user.password = hashedPassword;

      await this.dataService.users.save(user);

      return new ResponseViewModel<string>(HttpStatus.OK, 'Senha alterada com sucesso!');
    }
    catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

  async createAccount(dto: CreateAccountDTO): Promise<ResponseViewModel<string>> 
  {
    const isDocumentValid = (document: string) =>
      (document.length === 11 && DocumentHelper.validateCPF(document)) ||
      (document.length === 14);

    if (!isDocumentValid(dto.document))
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O documento pessoal inserido é inválido!');

    if (!isDocumentValid(dto.companyDocument))
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O documento da empresa inserido é inválido!');

    const user = await this.dataService.users.findOne({ where: { email: dto.email } });

    if (user !== null) {
      if (user.status === UserStatus.WAITING_EMAIL_VERIFICATION) {
        const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '12h' });
        const resetLink = `http://seuapp.com/confirm-account?token=${token}`;

        await this.emailService.addEmailToQueue
          ({
            to: user.email,
            subject: 'Confirmar minha conta',
            text: `Clique no link abaixo para confirmar sua nova conta: ${resetLink}`
          });

        return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST,
          'O e-mail informado já foi cadastrado e aguarda a confirmação por e-mail. Não esqueça de verificar a caixa de spam!');
      }
      else if (user.status === UserStatus.BLOCKED)
        return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O e-mail informado foi bloqueado. Entre em contato com o suporte!');
      else
        return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O e-mail informado já foi cadastrado. Caso tenha dificuldades em acessar sua conta, acesse a Central de Ajuda!');
    }

    const nUser = new User();
    nUser.email = dto.email;
    nUser.fullName = dto.fullName.toUpperCase();
    nUser.document = dto.document.toUpperCase();
    nUser.password = dto.password;
    nUser.status = UserStatus.WAITING_EMAIL_VERIFICATION;
    nUser.createdAt = new Date();
    nUser.updatedAt = new Date();
    nUser.createdBy = 'customer-onboarding';
    nUser.updatedBy = 'customer-onboarding';
    nUser.actived = true;

    await this.dataService.users.save(nUser);

    const nCompany = new Company();
    nCompany.document = dto.companyDocument;
    nCompany.socialName = dto.companySocialName;
    nCompany.fantasyName = dto.companyFantasyName;
    nCompany.owner = nUser;
    nCompany.createdAt = new Date();
    nCompany.updatedAt = new Date();
    nCompany.createdBy = 'customer-onboarding';
    nCompany.updatedBy = 'customer-onboarding';
    nCompany.actived = true;

    const nGroup = new Group();
    nGroup.name = "Administrador";
    nGroup.root = true;
    nGroup.owner = nUser;
    nGroup.createdAt = new Date();
    nGroup.updatedAt = new Date();
    nGroup.createdBy = 'customer-onboarding';
    nGroup.updatedBy = 'customer-onboarding';
    nGroup.actived = true;

    await this.dataService.companies.save(nCompany);
    await this.dataService.groups.save(nGroup);

    const nCompanyUserGroup = new CompanyUserGroup();
    nCompanyUserGroup.company = nCompany;
    nCompanyUserGroup.user = nUser;
    nCompanyUserGroup.group = nGroup;

    await this.dataService.companyUserGroups.save(nCompanyUserGroup);

    const token = this.jwtService.sign({ userId: nUser.id }, { expiresIn: '12h' });
    const resetLink = `http://seuapp.com/confirm-account?token=${token}`;

    await this.emailService
    .addEmailToQueue
    ({
      to: nUser.email,
      subject: 'Confirmar minha conta',
      text: `Clique no link abaixo para confirmar sua nova conta: ${resetLink}`
    });

    let message = 'Parabéns sua conta foi criada com sucesso e você ganhou 14 dias de acesso gratuito!';
    message += ' Enviamos um e-mail de confirmação para seu e-mail. Não esqueça de verificar a caixa de spam.'

    return new ResponseViewModel<string>(HttpStatus.CREATED, message);
  }

  async confirmAccount(token: string): Promise<ResponseViewModel<string>> 
  {
    const payload = this.jwtService.verify(token);
    const user = await this.dataService.users.findOne({ where: { id: payload.userId } });

    user.status = UserStatus.FREE_TRIAL_PERIOD;
    user.updatedAt = new Date();
    user.updatedBy = 'customer-onboarding';
    user.subscriptionStartDate = new Date();
    user.subscriptionEndDate = new Date();
    user.subscriptionEndDate.setDate(user.subscriptionStartDate.getDate() + 14);

    await this.dataService.users.save(user);
    return new ResponseViewModel<string>(HttpStatus.OK, 'Conta confirmada com sucesso!');
  }

  async getCLSUser(): Promise<UserDTO> {
    const user = this.clsService.get("user");
    const dto = new UserDTO();
    dto.email = user.email;
    dto.id = user.sud;
    dto.ownerId = user.ownerId;
    return dto;
  }
}
