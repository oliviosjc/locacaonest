import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UpdateCustomerAddressCommand } from "src/backoffice/commands/customers/addresses/update-customer-address.command";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { PermissionInterceptor } from "src/interceptors/permission.interceptor";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "src/utils/response.model";

@CommandHandler(UpdateCustomerAddressCommand)
@UseInterceptors(PermissionInterceptor)
export class UpdateCustomerAddressCommandHandler 
implements ICommandHandler<UpdateCustomerAddressCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}
    async execute(command: UpdateCustomerAddressCommand): Promise<ResponseViewModel<string>> 
    {
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        const customerAddress 
        = await this.dataService.customerAddresses.findOne({ where: { id: command.id }, relations: ['customer', 'owner'] });

        if(!customerAddress)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O endereço informado não existe na base de dados.');

        const owner = userLogged.owner === null ? userLogged : userLogged.owner;

        if(customerAddress.customer.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, ' Vocé não possui permissão para alterar este endereço.');

        customerAddress.alias = command.alias.toUpperCase();
        customerAddress.zipCode = command.zipCode.toUpperCase(); 
        customerAddress.address = command.address.toUpperCase(); 
        customerAddress.city = command.city.toUpperCase(); 
        customerAddress.state = command.state.toUpperCase(); 
        customerAddress.neighborhood = command.neighborhood.toUpperCase(); 
        customerAddress.number = command.number; 
        customerAddress.complement = command.complement; 
        customerAddress.reference = command.reference; 

        await this.dataService.customerAddresses.save(customerAddress);
        return new ResponseViewModel<string>(HttpStatus.OK, 'O endereço foi alterado com sucesso!');
    }
}