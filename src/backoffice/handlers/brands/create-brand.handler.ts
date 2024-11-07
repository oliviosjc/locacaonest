import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateBrandCommand } from "../../../backoffice/commands/brands/create-brand.command";
import { IDataService } from "../../../database/repositories/interfaces/data-service.interface";
import { User } from "../../../users/entities/user.entity";
import { GetUserByCLSQuery } from "../../../users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "../../../utils/response.model";
import { UsersService } from "../../../users/users.service";
import { PermissionInterceptor } from "../../../interceptors/permission.interceptor";

@CommandHandler(CreateBrandCommand)
@UseInterceptors(PermissionInterceptor)
export class CreateBrandCommandHandler 
    implements ICommandHandler<CreateBrandCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus,
        private readonly userService: UsersService)
    {}

    async execute(command: CreateBrandCommand): Promise<ResponseViewModel<string>> 
    {
        const { name, description, image } = command;

        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');
        
        const hasPermission 
        = await this.userService.hasUserPermission(userLogged.id, command.companyId, command.groupId, 'CreateBrandCommandHandler', this.dataService);

        if (!hasPermission)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar marcas nesta empresa/grupo!');

        const nBrand 
        = await this.dataService.brands.create
        ({
            name,
            description,
            image,
            actived: true,
            owner: userLogged.owner === null ? userLogged : userLogged.owner,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userLogged.email,
            updatedBy: userLogged.email
        });

        await this.dataService.brands.save(nBrand);

        return new ResponseViewModel<string>(HttpStatus.OK, 'Marca criada com sucesso!');
    }
}