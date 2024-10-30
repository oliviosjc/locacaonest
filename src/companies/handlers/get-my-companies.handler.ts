import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetMyCompaniesQuery } from "../queries/get-my-companies.query";
import { IDataService } from "../../database/repositories/interfaces/data-service.interface";
import { GetMyCompaniesDTO } from "../dtos/get-my-companies.dto";
import { ResponseViewModel } from "../../utils/response.model";
import { GetUserByCLSQuery } from "../../users/queries/get-user-by-cls.query";
import { User } from "../../users/entities/user.entity";
import { HttpStatus } from "@nestjs/common";
import { Company } from "../entities/company.entity";

@QueryHandler(GetMyCompaniesQuery)
export class GetMyCompaniesQueryHandler implements IQueryHandler<GetMyCompaniesQuery> {
    constructor(private readonly dataService: IDataService,
        private readonly queryBus: QueryBus
    ) { }
    async execute(query: GetMyCompaniesQuery): Promise<ResponseViewModel<GetMyCompaniesDTO[]>> {
        const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
        if (!userLogged)
            return new ResponseViewModel<GetMyCompaniesDTO[]>(HttpStatus.UNAUTHORIZED, 'Usuário não autenticado!');

        let companies : Company[] = [];
        let response: GetMyCompaniesDTO[] = [];

        if(userLogged.owner === null)
        {
            companies 
            = (await this.dataService.companies.find({ where: { owner: userLogged }, relations: ['owner'] }));
            
            response 
            = companies.map(company => 
                new GetMyCompaniesDTO(company.id, company.socialName, company.fantasyName, company.document, company.owner));
        }
        else
        {
            companies
            = (await this.dataService.companyUserGroups.find({ where: { userId: userLogged.id }, relations: ['company'] }))
            .map(companyUserGroup => companyUserGroup.company)
            .filter((company, index, self) =>
                index === self.findIndex((c) => c.id=== company.id));

            response 
            = companies.map(company => 
                new GetMyCompaniesDTO(company.id, company.socialName, company.fantasyName, company.document, company.owner));
        }

        if(response && response.length > 0)
            return new ResponseViewModel<GetMyCompaniesDTO[]>(HttpStatus.OK, 'As companias foram encontradas com sucesso na base de dados!', response);
        else
            return new ResponseViewModel<GetMyCompaniesDTO[]>(HttpStatus.NO_CONTENT, 'Nenhuma compania encontrada na base de dados.');
    }
}