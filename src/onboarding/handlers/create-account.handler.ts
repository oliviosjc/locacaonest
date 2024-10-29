import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAccountCommand } from "../commands/create-account.command";
import { ResponseViewModel } from "src/utils/response.model";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { DocumentHelper } from "src/utils/document.helper";
import { HttpStatus } from "@nestjs/common";
import { UserStatus } from "src/users/enumerators/user-status.enumerator";

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {
    constructor(private readonly dataService: IDataService) { }

    async execute(command: CreateAccountCommand): Promise<ResponseViewModel<string>> {
        let documentISValid = true;
        if (command.document.length == 11)
            documentISValid = DocumentHelper.validateCPF(command.document);

        if (command.document.length !== 14)
            documentISValid = false;

        if (!documentISValid)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O documento inserido é inválido!');

        const user = await this.dataService.users.findOne({ where: { email: command.email } });

        if (user !== null) {
            if (user.status === UserStatus.WAITING_EMAIL_VERIFICATION)
                return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST,
                    'O e-mail informado já foi cadastrado e aguarda a confirmação por e-mail. Não esqueça de verificar a caixa de spam!');
            else if (user.status === UserStatus.BLOCKED)
                return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O e-mail informado foi bloqueado. Entre em contato com o suporte!');
            else
                return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O e-mail informado já foi cadastrado. Caso tenha dificuldades em acessar sua conta, acesse a Central de Ajuda!');
        }

        const nUser = await this.dataService.users.create
        ({
            fullName: command.fullName.toUpperCase(),
            email: command.email,
            password: command.password,
            document: command.document,
            status: UserStatus.WAITING_EMAIL_VERIFICATION,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'customer-onboarding',
            updatedBy: 'customer-onboarding',
            actived: true
        });

        await this.dataService.users.save(nUser);

        let message = 'Parabéns sua conta foi criada com sucesso e você ganhou 14 dias de acesso gratuito!';
        message += ' Enviamos um e-mail de confirmação para seu e-mail. Não esqueça de verificar a caixa de spam.'

        return new ResponseViewModel<string>(HttpStatus.CREATED, message);
    }
}