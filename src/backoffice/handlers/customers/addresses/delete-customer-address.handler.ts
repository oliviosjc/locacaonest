import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { DeleteCustomerAddressCommand } from "src/backoffice/commands/customers/addresses/delete-customer-address.command";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { PermissionInterceptor } from "src/interceptors/permission.interceptor";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "src/utils/response.model";

@CommandHandler(DeleteCustomerAddressCommand)
@UseInterceptors(PermissionInterceptor)
export class DeleteCustomerAddressCommandHandler
    implements ICommandHandler<DeleteCustomerAddressCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}

    async execute(command: DeleteCustomerAddressCommand): Promise<ResponseViewModel<string>> 
    {
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        const customerAddress 
        = await this.dataService.customerAddresses.findOne({ where: { id: command.id }, relations: ['customer', 'owner']});

        if(!customerAddress)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O endereço informado não existe na base de dados.');

        const owner = userLogged.owner === null ? userLogged : userLogged.owner;

        if(customerAddress.customer.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, ' Vocé não possui permissão para remover este endereço.');

        await this.dataService.customerAddresses.remove(customerAddress);
        return new ResponseViewModel<string>(HttpStatus.OK, 'O endereço foi excluído com sucesso!');
    }
}