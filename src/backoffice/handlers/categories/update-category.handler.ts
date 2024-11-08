import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UpdateCategoryCommand } from "src/backoffice/commands/categories/update-category.command";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { PermissionInterceptor } from "src/interceptors/permission.interceptor";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "src/utils/response.model";

@CommandHandler(UpdateCategoryCommand)
@UseInterceptors(PermissionInterceptor)
export class UpdateCategoryCommandHandler 
implements ICommandHandler<UpdateCategoryCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}
    async execute(command: UpdateCategoryCommand): Promise<ResponseViewModel<string>> 
    {
        const { id, name, description } = command;
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        
        const category 
        = await this.dataService.categories.findOne({ where: { id }, relations: ['owner'] });

        if(!category)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'A categoria informada não existe na base de dados.');

        const owner = userLogged.owner === null ? userLogged : userLogged.owner;

        if(category.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para alterar esta categoria.');

        category.name = name;
        category.description = description;
        category.updatedAt = new Date();    
        category.updatedBy = userLogged.email;

        await this.dataService.categories.save(category);

        return new ResponseViewModel<string>(HttpStatus.OK, 'A categoria foi alterada com sucesso!');
    }
}