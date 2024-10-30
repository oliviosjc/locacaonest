import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerContactCommand } 
    from "../../../../backoffice/commands/customers/contacts/create-customer-contact.command";
import { ResponseViewModel } from "../../../../utils/response.model";
import { IDataService } from "../../../../database/repositories/interfaces/data-service.interface";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(CreateCustomerContactCommand)
export class CreateCustomerContactCommandHandler
    implements ICommandHandler<CreateCustomerContactCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}
    async execute(command: CreateCustomerContactCommand): Promise<ResponseViewModel<string>> 
    {
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        const customer 
        = await this.dataService.customers.findOne({ where: { id: command.customerId }, relations: ['owner'] });
        if(!customer || customer.owner.id !== userLogged.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um contato.');

        const nContact
        = await this.dataService.customerContacts.create(
            {
                customer: customer,
                name: command.name,
                position: command.position,
                email: command.email,
                whatsapp: command.whatsapp,
                systemCommunication: command.systemCommunication
            }
        );

        await this.dataService.customerContacts.save(nContact);
        return new ResponseViewModel<string>(HttpStatus.OK, 'O contato foi criado com sucesso!');
    }
}