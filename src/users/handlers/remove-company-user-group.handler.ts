import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { RemoveCompanyUserGroupCommand } from "../commands/remove-company-user-group.command";
import { IDataService } from "../../database/repositories/interfaces/data-service.interface";
import { UsersService } from "../users.service";
import { ResponseViewModel } from "../../utils/response.model";
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
        
        const owner = userLogged.owner || userLogged;

        await this.getEntityWithOwner(this.dataService.groups, groupId, 'O grupo informado não existe na base de dados!');

        await this.getEntityWithOwner(this.dataService.companies, companyId, 'A empresa informada não existe na base de dados!');

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