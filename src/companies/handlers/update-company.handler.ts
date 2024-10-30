import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UpdateCompanyCommand } from "../commands/update-company.command";
import { ResponseViewModel } from "../../utils/response.model";
import { IDataService } from "../../database/repositories/interfaces/data-service.interface";
import { User } from "../../users/entities/user.entity";
import { GetUserByCLSQuery } from "../../users/queries/get-user-by-cls.query";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyCommandHandler implements ICommandHandler<UpdateCompanyCommand> {
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ) { }

    async execute(command: UpdateCompanyCommand): Promise<ResponseViewModel<string>> {
        const { id, socialName, fantasyName, document } = command;

        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'Usuário não autenticado!');

        const company = await this.dataService.companies.findOne({ where: { id }, relations: ['owner'] });
        if (!company)
            return new ResponseViewModel<string>(HttpStatus.NOT_FOUND, 'Empresa não encontrada!');

        if(company.owner.id !== userLogged.id)
            return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, ' Vocé não possui permissão para editar uma empresa!');

        company.socialName = socialName;
        company.fantasyName = fantasyName;
        company.document = document;
        company.updatedBy = userLogged.email;
        company.updatedAt = new Date();

        await this.dataService.companies.save(company);

        return new ResponseViewModel<string>(HttpStatus.OK, 'Dados da empresa alterados com sucesso!');
    }
}