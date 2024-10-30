import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByCLSQuery } from "../queries/get-user-by-cls.query";
import { AuthService } from "../../auth/auth.service";
import { IDataService } from "../../database/repositories/interfaces/data-service.interface";
import { User } from "../entities/user.entity";

@QueryHandler(GetUserByCLSQuery)
export class GetUserByCLSQueryHandler implements IQueryHandler<GetUserByCLSQuery> {
    private readonly cache = new Map<string, User>();

    constructor(private readonly authService: AuthService,
        private readonly dataService: IDataService,
    ) { }

    async execute(query: GetUserByCLSQuery): Promise<User> {
        const userCLS = await this.authService.getCLSUser();
        if (userCLS === null)
            return null;

        const cachedUser = this.cache.get(userCLS.email);
        if (cachedUser)
            return cachedUser;

        const user = await this.dataService.users.findOne({
            where: { email: userCLS.email },
            relations: ['owner'],
        });

        if (user)
            this.cache.set(userCLS.email, user);

        return user;
    }
}