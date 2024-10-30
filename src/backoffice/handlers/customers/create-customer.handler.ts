import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerCommand } from "../../../backoffice/commands/customers/create-customer.command";
import { ResponseViewModel } from "../../../utils/response.model";
import { IDataService } from "../../../database/repositories/interfaces/data-service.interface";
import { GetUserByCLSQuery } from "../../../users/queries/get-user-by-cls.query";
import { User } from "../../../users/entities/user.entity";
import { HttpStatus } from "@nestjs/common";
import { DocumentHelper } from "../../../utils/document.helper";

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerCommandHandler implements ICommandHandler<CreateCustomerCommand, ResponseViewModel<string>> {
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ) { }
    async execute(command: CreateCustomerCommand): Promise<ResponseViewModel<string>> {
        let documentISValid = true;
        if (command.document.length == 11)
            documentISValid = DocumentHelper.validateCPF(command.document);
        else if (command.document.length !== 14)
            documentISValid = false;

        if (!documentISValid)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O documento inserido é inválido!');

        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        if (userLogged.owner !== null)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um cliente.');

        const customer
            = await this.dataService.customers.findOne({ where: { document: command.document, owner: userLogged }, relations: ['owner'] });

        if (customer)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'Ja existe um cliente com o CPF informado.');

        const nCustomer = await this.dataService.customers.create({
            name: command.name,
            document: command.document,
            owner: userLogged,
            actived: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userLogged.email,
            updatedBy: userLogged.email
        });

        return new ResponseViewModel<string>(HttpStatus.OK, 'Cliente criado com sucesso!', nCustomer.id);
    }
}