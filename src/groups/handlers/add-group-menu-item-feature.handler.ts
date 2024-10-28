import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { AddGroupMenuItemFeatureCommand } from "../commands/add-group-menu-item-feature.command";
import { ResponseViewModel } from "src/utils/response.model";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { GetUserByCLSQuery } from "src/users/queries/get-user-by-cls.query";
import { User } from "src/users/entities/user.entity";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(AddGroupMenuItemFeatureCommand)
export class AddGroupMenuItemFeatureCommandHandler implements ICommandHandler<AddGroupMenuItemFeatureCommand> {
    constructor(
        private readonly dataService: IDataService,
        private readonly queryBus: QueryBus,
    ) { }
    
    async execute(command: AddGroupMenuItemFeatureCommand): Promise<ResponseViewModel<string>> {
        const { groupId, menuItemId, menuItemFeatureId } = command;
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        const group = await this.dataService.groups.findOne({ where: { id: groupId }, relations: ['owner'] });

        if (!group || group.owner.id !== userLogged.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para adicionar menu item a este grupo.');

        const groupMenuItemFeature = await this.dataService.groupMenuItemFeatures.findOne({ where: { menuItemId, menuItemFeatureId } });

        if (groupMenuItemFeature !== null)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'Menu item/feature ja adicionado a este grupo.');

        const menuItem = await this.dataService.menuItems.findOne({ where: { id: menuItemId }, relations: ['features'] });

        if (!menuItem)
            return new ResponseViewModel<string>(HttpStatus.NOT_FOUND, 'O item de menu não encontrado na base de dados.');

        const menuItemFeature = menuItem.features.find(feature => feature.id === menuItemFeatureId);

        if (!menuItemFeature)
            return new ResponseViewModel<string>(HttpStatus.NOT_FOUND, 'A feature não possui vinculo com este item de menu.');

        const newGroupMenuItemFeature 
        = await this.dataService.groupMenuItemFeatures.create({ menuItemId, menuItemFeatureId, groupId });

        await this.dataService.groupMenuItemFeatures.save(newGroupMenuItemFeature); 

        return new ResponseViewModel<string>(HttpStatus.OK, 'Menu item/feature adicionado ao grupo com sucesso!');   
    }
}