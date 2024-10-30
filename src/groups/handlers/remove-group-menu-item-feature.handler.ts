import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { RemoveGroupMenuItemFeatureCommand } from "../commands/remove-group-menu-item-feature.command";
import { ResponseViewModel } from "../../utils/response.model";
import { IDataService } from "../../database/repositories/interfaces/data-service.interface";
import { GetUserByCLSQuery } from "../../users/queries/get-user-by-cls.query";
import { User } from "../../users/entities/user.entity";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(RemoveGroupMenuItemFeatureCommand)
export class RemoveGroupMenuItemFeatureCommandHandler implements ICommandHandler<RemoveGroupMenuItemFeatureCommand>
{
    constructor(
        private readonly dataService: IDataService,
        private readonly queryBus: QueryBus,
    ) { }

    async execute(command: RemoveGroupMenuItemFeatureCommand): Promise<ResponseViewModel<string>> 
    {
        const { groupId, menuItemId, menuItemFeatureId } = command;
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        const groupMenuItemFeature 
        = await this.dataService.groupMenuItemFeatures
        .findOne({ where: { groupId,menuItemId, menuItemFeatureId }, relations: ['group'] });

        if(groupMenuItemFeature === null)
            return new ResponseViewModel<string>(HttpStatus.NOT_FOUND, 'A relação deste item de menu, com essa feature para esse grupo não foi encontrada na base de dados.');

        if(groupMenuItemFeature.group.owner.id !== userLogged.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para remover este item de menu.');

        await this.dataService.groupMenuItemFeatures.remove(groupMenuItemFeature);
        return new ResponseViewModel<string>(HttpStatus.OK, 'A feature deste item de menu foi removida do grupo com sucesso.');
    }

}