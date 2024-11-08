import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UpdateCustomerContactCommand } from "src/backoffice/commands/customers/contacts/update-customer-contact.command";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { PermissionInterceptor } from "src/interceptors/permission.interceptor";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "src/utils/response.model";

@CommandHandler(UpdateCustomerContactCommand)
@UseInterceptors(PermissionInterceptor)
export class UpdateCustomerContactCommandHandler implements ICommandHandler<UpdateCustomerContactCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}

    async execute(command: UpdateCustomerContactCommand): Promise<ResponseViewModel<string>>
    {
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        const customerContact 
            = await this.dataService.customerContacts.findOne({ where: { id: command.id }, relations: ['customer', 'owner'] });

        if(!customerContact)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O contato informado não existe na base de dados.');

        const owner = userLogged.owner === null ? userLogged : userLogged.owner;

        if(customerContact.customer.owner.id !== owner.id)    
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, ' Vocé não possui permissão para alterar este contato.');

        customerContact.name = command.name.toUpperCase();
        customerContact.position = command.position;
        customerContact.email = command.email;
        customerContact.whatsapp = command.whatsapp;
        customerContact.systemCommunication = command.systemCommunication;

        await this.dataService.customerContacts.save(customerContact);
        return new ResponseViewModel<string>(HttpStatus.OK, 'O contato foi alterado com sucesso!');
    }
}