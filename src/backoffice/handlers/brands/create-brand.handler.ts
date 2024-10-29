import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateBrandCommand } from "src/backoffice/commands/brands/create-brand.command";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { User } from "src/users/entities/user.entity";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "src/utils/response.model";

@CommandHandler(CreateBrandCommand)
export class CreateBrandCommandHandler implements ICommandHandler<CreateBrandCommand>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    )
    {}

    async execute(command: CreateBrandCommand): Promise<ResponseViewModel<string>> 
    {
        const { name, description, image } = command;

        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        if(userLogged.owner !== null)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar uma marca.');

        const nBrand = await this.dataService.brands.create({
            name,
            description,
            image,
            owner: userLogged,
            actived: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userLogged.email,
            updatedBy: userLogged.email
        });

        await this.dataService.brands.save(nBrand);

        return new ResponseViewModel<string>(HttpStatus.OK, 'Marca criada com sucesso!');
    }
}