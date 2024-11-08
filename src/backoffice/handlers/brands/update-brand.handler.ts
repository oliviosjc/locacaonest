import { HttpStatus, UseInterceptors } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UpdateBrandCommand } from "src/backoffice/commands/brands/update-brand.command";
import { Brand } from "src/backoffice/entities/brands/brand.entity";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { PermissionInterceptor } from "src/interceptors/permission.interceptor";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "src/utils/response.model";

@CommandHandler(UpdateBrandCommand)
@UseInterceptors(PermissionInterceptor)
export class UpdateBrandCommandHandler implements ICommandHandler<UpdateBrandCommand, ResponseViewModel<string>>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}
    
    async execute(command: UpdateBrandCommand): Promise<ResponseViewModel<string>> 
    {
        const { id, name, description, image } = command;
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        const brand 
        = await this.dataService.brands.findOne({ where: { id }, relations: ['owner'] });

        if(!brand)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 
        'A marca informada não existe na base de dados.');

        const owner = userLogged.owner === null ? userLogged : userLogged.owner;

        if(brand.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 
        'Você não possui permissão para alterar esta marca.');

        brand.updatedAt = new Date();
        brand.updatedBy = userLogged.email;
        brand.name = name;
        brand.description = description;
        brand.image = image;

        await this.dataService.brands.save(brand);

        return new ResponseViewModel<string>(HttpStatus.OK, 'A marca foi alterada com sucesso!');
    }
}