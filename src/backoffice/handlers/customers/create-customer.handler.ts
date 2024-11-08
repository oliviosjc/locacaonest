import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerCommand } from "../../../backoffice/commands/customers/create-customer.command";
import { ResponseViewModel } from "../../../utils/response.model";
import { IDataService } from "../../../database/repositories/interfaces/data-service.interface";
import { GetUserByCLSQuery } from "../../../users/queries/get-user-by-cls.query";
import { User } from "../../../users/entities/user.entity";
import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { DocumentHelper } from "../../../utils/document.helper";
import { PermissionInterceptor } from "src/interceptors/permission.interceptor";

@CommandHandler(CreateCustomerCommand)
@UseInterceptors(PermissionInterceptor)
export class CreateCustomerCommandHandler implements ICommandHandler<CreateCustomerCommand, ResponseViewModel<string>> {
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ) { }
    async execute(command: CreateCustomerCommand): Promise<ResponseViewModel<string>> {
        const isDocumentValid = (document: string) =>
            (document.length === 11 && DocumentHelper.validateCPF(document)) ||
            (document.length === 14);

        if (!isDocumentValid(command.document))
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O documento pessoal inserido é inválido!');

        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        const customer
            = await this.dataService.customers.findOne({ where: { document: command.document, owner: userLogged }, 
                relations: ['owner'] });

        if (customer)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'Ja existe um cliente com o CPF informado.');

        const nCustomer = await this.dataService.customers.create({
            name: command.name,
            document: command.document,
            owner: userLogged.owner === null ? userLogged : userLogged.owner,
            actived: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userLogged.email,
            updatedBy: userLogged.email
        });

        await this.dataService.customers.save(nCustomer);

        return new ResponseViewModel<string>(HttpStatus.OK, 'Cliente criado com sucesso!', nCustomer.id);
    }
}