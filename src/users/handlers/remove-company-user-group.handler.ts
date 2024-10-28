import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { RemoveCompanyUserGroupCommand } from "../commands/remove-company-user-group.command";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { UsersService } from "../users.service";
import { ResponseViewModel } from "src/utils/response.model";
import { GetUserByCLSQuery } from "../queries/get-user-by-cls.query";
import { User } from "../entities/user.entity";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(RemoveCompanyUserGroupCommand)
export class RemoveCompanyUserGroupCommandHandler implements ICommandHandler<RemoveCompanyUserGroupCommand>
{
    constructor(private readonly dataService: IDataService,
        private readonly userService: UsersService,
        private readonly queryBus: QueryBus
    ) { }
    
    async execute(command: RemoveCompanyUserGroupCommand): Promise<ResponseViewModel<string>> {
        const { userId, groupId, companyId } = command;
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

        const owner = userLogged.owner || userLogged;

        const group = await this.getEntityWithOwner(this.dataService.groups, groupId, 'O grupo informado não existe na base de dados!');
        if (!group || group.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para remover usuários deste grupo.');

        const company = await this.getEntityWithOwner(this.dataService.companies, companyId, 'A empresa informada não existe na base de dados!');
        if (!company || company.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para remover usuarios desta compania.');

        let hasPermission = false;

        if (userLogged.id === group.owner.id
            && userLogged.id === company.owner.id)
            hasPermission = true;
        else
            hasPermission = await this.userService.hasCreateUserPermission(userLogged.id, company.id, 'RemoveCompanyUserGroupCommandHandler', this.dataService);

        if(hasPermission === false)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para remover usuários deste grupo/compania.');

        const companyUserGroup
         = await this.dataService.companyUserGroups.findOne({ where: { userId, groupId, companyId } });

         if(companyUserGroup === null)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O vínculo entre este usuário, grupo e compania não foi encontrado na base de dados.');

        await this.dataService.companyUserGroups.remove(companyUserGroup);
        return new ResponseViewModel<string>(HttpStatus.OK, 'O válnculo entre este usuário, grupo e compania foi removido com sucesso.');
    }

    private async getEntityWithOwner(repository, id: string, errorMessage: string): Promise<any> {
        const entity = await repository.findOne({ where: { id }, relations: ['owner'] });
        if (!entity) {
            throw new ResponseViewModel(HttpStatus.BAD_REQUEST, errorMessage);
        }
        return entity;
    }
}