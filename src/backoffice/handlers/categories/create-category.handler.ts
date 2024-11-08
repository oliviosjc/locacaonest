import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCategoryCommand } from "../../../backoffice/commands/categories/create-category.command";
import { IDataService } from "../../../database/repositories/interfaces/data-service.interface";
import { User } from "../../../users/entities/user.entity";
import { GetUserByCLSQuery } from "../../../users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "../../../utils/response.model";
import { PermissionInterceptor } from "../../../interceptors/permission.interceptor";

@CommandHandler(CreateCategoryCommand)
@UseInterceptors(PermissionInterceptor)
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand> {
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ) { }
    async execute(command: CreateCategoryCommand): Promise<ResponseViewModel<string>> 
    {
        const { name, description } = command;
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        var nCategory = await this.dataService.categories.create({
            name,
            description,
            owner: userLogged.owner === null ? userLogged : userLogged.owner,
            actived: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userLogged.email,
            updatedBy: userLogged.email
        });

        await this.dataService.categories.save(nCategory);
        return new ResponseViewModel<string>(HttpStatus.OK, 'Categoria criada com sucesso!');
    }
}