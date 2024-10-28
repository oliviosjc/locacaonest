import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { ResponseViewModel } from "src/utils/response.model";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";
import { User } from "../entities/user.entity";
import { GetUserByCLSQuery } from "../queries/get-user-by-cls.query";
import { AddCompanyUserGroupCommand } from "../commands/add-company-user-group.command";

@Injectable()
@CommandHandler(AddCompanyUserGroupCommand)
export class AddCompanyUserGroupCommandHandler implements ICommandHandler<AddCompanyUserGroupCommand> {
    constructor(private readonly dataService: IDataService,
        private readonly userService: UsersService,
        private readonly queryBus: QueryBus
    ) { }

    async execute(command: AddCompanyUserGroupCommand): Promise<ResponseViewModel<string>> {
        const { userId, groupId, companyId } = command;
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'Usuário não autenticado!');

        const owner = userLogged.owner || userLogged;

        const group = await this.getEntityWithOwner(this.dataService.groups, groupId, 'O grupo informado não existe na base de dados!');
        if (!group || group.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para criar um usuário na base de dados!');

        const company = await this.getEntityWithOwner(this.dataService.companies, companyId, 'A empresa informada não existe na base de dados!');
        if (!company || company.owner.id !== owner.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para criar um usuário na base de dados!');

        let hasPermission = false;

        if (userLogged.id === group.owner.id
            && userLogged.id === company.owner.id)
            hasPermission = true;
        else
            hasPermission = await this.userService.hasCreateUserPermission(userLogged.id, company.id, 'AddCompanyUserGroupCommandHandler', this.dataService);

        if (hasPermission === false)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Não foi possível criar um usuário na base de dados!');

        const userGroupCompanyExists = await this.dataService.companyUserGroups.findOne({ where: { userId, groupId, companyId } });

        if (userGroupCompanyExists)
            return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O usuário informado ja pertence a compania/grupo informado!');

        const nCompanyUserGroup = await this.dataService.companyUserGroups.create({
            userId: userId,
            groupId: groupId,
            companyId: companyId
        });

        await this.dataService.companyUserGroups.save(nCompanyUserGroup);

        return new ResponseViewModel<string>(HttpStatus.OK, 'Usuário vinculado com sucesso ao grupo/compania.');
    }

    private async getEntityWithOwner(repository, id: string, errorMessage: string): Promise<any> {
        const entity = await repository.findOne({ where: { id }, relations: ['owner'] });
        if (!entity) {
            throw new ResponseViewModel(HttpStatus.BAD_REQUEST, errorMessage);
        }
        return entity;
    }
}