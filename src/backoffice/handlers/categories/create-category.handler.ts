import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateCategoryCommand } from "src/backoffice/commands/categories/create-category.command";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "src/utils/response.model";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}
    async execute(command: CreateCategoryCommand): Promise<ResponseViewModel<string>> 
    {
        const { name, description } = command;

        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        if(userLogged.owner !== null)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar uma categoria.');

        var nCategory = await this.dataService.categories.create({
            name,
            description,
            owner: userLogged,
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