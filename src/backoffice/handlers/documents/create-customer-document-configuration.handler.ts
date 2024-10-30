import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerDocumentConfigurationCommand } 
    from "../../../backoffice/commands/customers/documents/create-customer-document-configuration.command";
import { ResponseViewModel } from "../../../utils/response.model";
import { IDataService } from "../../../database/repositories/interfaces/data-service.interface";
import { User } from "../../../users/entities/user.entity";
import { GetUserByCLSQuery } from "../../../users/queries/get-user-by-cls.query";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(CreateCustomerDocumentConfigurationCommand)
export class CreateCustomerDocumentConfigurationCommandHandler 
    implements ICommandHandler<CreateCustomerDocumentConfigurationCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}

    async execute(command: CreateCustomerDocumentConfigurationCommand): Promise<ResponseViewModel<string>> 
    {
        const { name, required } = command;
        
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        if(userLogged.owner !== null)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um documento.');

        const configurations 
            = await this.dataService.customerDocumentConfigurations.find({ where: { owner: userLogged }, relations: ['owner'] });

        const nConfiguration = await this.dataService.customerDocumentConfigurations.create
        ({
            name,
            required,
            owner: userLogged,
            order: (configurations?.length ? Math.max(...configurations.map(c => c.order)) + 1 : 1)
        });

        await this.dataService.customerDocumentConfigurations.save(nConfiguration);

        return new ResponseViewModel<string>(HttpStatus.OK, 'Configuração criada com sucesso!');
    }
}