import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateModelCommand } from "../../../backoffice/commands/models/create-model.command";
import { IDataService } from "../../../database/repositories/interfaces/data-service.interface";
import { User } from "../../../users/entities/user.entity";
import { GetUserByCLSQuery } from "../../../users/queries/get-user-by-cls.query";
import { ResponseViewModel } from "../../../utils/response.model";

@CommandHandler(CreateModelCommand)
export class CreateModelCommandHandler implements ICommandHandler<CreateModelCommand>
{
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ){}

    async execute(command: CreateModelCommand): Promise<ResponseViewModel<string>> 
    {
        const { name, description, image, brandId, categoryId } = command;

        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        if(userLogged.owner !== null)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um modelo.');

        const brand = await this.dataService.brands.findOne({ where: { id: brandId }, relations: ['owner'] });
        const category = await this.dataService.categories.findOne({ where: { id: categoryId }, relations: ['owner'] });
        
        if(!brand || !category)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'A marca e/ou categoria informadas não existem na base de dados.');

        if(brand.owner.id !== userLogged.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um modelo nesta marca.');

        if(category.owner.id !== userLogged.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar um modelo nesta categoria.');

        const nModel = await this.dataService.models.create({
            name,
            description,
            image,
            brand,
            category,
            owner: userLogged,
            actived: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userLogged.email,
            updatedBy: userLogged.email
        });

        await this.dataService.models.save(nModel); 

        return new ResponseViewModel<string>(HttpStatus.OK, 'Modelo criado com sucesso!');
    }
}