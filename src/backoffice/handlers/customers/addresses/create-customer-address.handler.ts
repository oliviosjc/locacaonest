import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerAddressCommand } from "../../../../backoffice/commands/customers/addresses/create-customer-address.command";
import { IDataService } from "../../../../database/repositories/interfaces/data-service.interface";
import { ResponseViewModel } from "../../../../utils/response.model";
import { GetUserByCLSQuery } from "../../../../users/queries/get-user-by-cls.query";
import { User } from "../../../../users/entities/user.entity";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(CreateCustomerAddressCommand)
export class CreateCustomerAddressCommandHandler 
implements ICommandHandler<CreateCustomerAddressCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}
    async execute(command: CreateCustomerAddressCommand): Promise<ResponseViewModel<string>> 
    {
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        if(userLogged.owner !== null)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um endereço.');

        const customer = await this.dataService.customers.findOne({ where: { id: command.customerId }, relations: ['owner'] });
        if(!customer || customer.owner.id !== userLogged.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um endereço.');

        const nAddress 
        = await this.dataService.customerAddresses.create
        ({
            zipCode: command.zipCode,
            address: command.address,
            city: command.city,
            state: command.state,
            neighborhood: command.neighborhood,
            number: command.number,
            complement: command.complement,
            customer,
            reference: command.reference,
            alias: command.alias
        });

        await this.dataService.customerAddresses.save(nAddress);
        return new ResponseViewModel<string>(HttpStatus.OK, 'Endereço criado com sucesso!', nAddress.id);
    }
}