import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { User } from 'src/users/entities/user.entity';
import { GetUserByCLSQuery } from 'src/users/queries/get-user-by-cls.query';
import { UsersService } from 'src/users/users.service';
import { BaseCommand } from 'src/utils/base.command';

@Injectable()
export class PermissionInterceptor implements NestInterceptor
{
    constructor(
        private readonly userService: UsersService,
        private readonly queryBus: QueryBus,
        private readonly dataService: IDataService
    ){}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> 
    {
        const handlerName = context.getHandler().name;
        const [command] = context.getArgs();

        if (command instanceof BaseCommand)
        {
            const { companyId, groupId } = command;
            const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

            if (!userLogged)
                throw new UnauthorizedException('User is not authenticated');

            const group 
            = await this.dataService.groups.findOne({ where: { id: groupId }, relations: ['owner'] });

            if(group === null)
                throw new ForbiddenException('Group does not exist');

            if(group.owner.id === userLogged.id
            && group.root === true)
                return next.handle();

            const hasPermission 
            = await this.userService.hasUserPermission(
                userLogged.id, 
                companyId, 
                groupId, 
                handlerName, 
                this.dataService
            );

            if (!hasPermission)
                throw new ForbiddenException('User does not have permission to perform this action');
        }

        return next.handle();
    }
}
