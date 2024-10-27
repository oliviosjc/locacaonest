import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByCLSQuery } from "../queries/get-user-by-cls.query";
import { AuthService } from "src/auth/auth.service";
import { IDataService } from "src/database/repositories/interfaces/data-service.interface";
import { User } from "../entities/user.entity";

@QueryHandler(GetUserByCLSQuery)
export class GetUserByCLSQueryHandler implements IQueryHandler<GetUserByCLSQuery>
{
    constructor(private readonly authService: AuthService,
        private readonly dataService: IDataService,
    ) {}

    async execute(query: GetUserByCLSQuery): Promise<User> 
    {
        const userCLS = await this.authService.getCLSUser();
        if(userCLS === null)
            return null;

        const user = await this.dataService.users.findOne({
            where: { email: userCLS.email },
        });
        
        
        return user;
    }
}