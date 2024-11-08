import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerContactCommand } 
    from "../../../../backoffice/commands/customers/contacts/create-customer-contact.command";
import { ResponseViewModel } from "../../../../utils/response.model";
import { IDataService } from "../../../../database/repositories/interfaces/data-service.interface";
import { User } from "../../../../users/entities/user.entity";
import { GetUserByCLSQuery } from "../../../../users/queries/get-user-by-cls.query";
import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { PermissionInterceptor } from "src/interceptors/permission.interceptor";

@CommandHandler(CreateCustomerContactCommand)
@UseInterceptors(PermissionInterceptor)
export class CreateCustomerContactCommandHandler
    implements ICommandHandler<CreateCustomerContactCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}
    async execute(command: CreateCustomerContactCommand): Promise<ResponseViewModel<string>> 
    {
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        const customer 
        = await this.dataService.customers.findOne({ where: { id: command.customerId }, relations: ['owner'] });

        if(!customer)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 
        'O cliente informado não existe na base de dados.');

        const owner = userLogged.owner === null ? userLogged : userLogged.owner;

        if(customer.owner.id !== owner.id)    
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para vincular contatos a este cliente.');

        const nContact
        = await this.dataService.customerContacts.create(
            {
                customer: customer,
                name: command.name.toUpperCase(),
                position: command.position.toUpperCase(),
                email: command.email,
                whatsapp: command.whatsapp,
                systemCommunication: command.systemCommunication
            }
        );

        await this.dataService.customerContacts.save(nContact);
        return new ResponseViewModel<string>(HttpStatus.OK, 'O contato foi criado com sucesso!');
    }
}