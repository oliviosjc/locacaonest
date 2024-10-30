import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserCommandHandler } from './handlers/create-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserByCLSQueryHandler } from './handlers/get-user-by-cls.handler';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { AddCompanyUserGroupCommandHandler } from './handlers/add-company-user-group.handler';
import { RemoveCompanyUserGroupCommandHandler } from './handlers/remove-company-user-group.handler';

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [UsersController],
  providers: [CreateUserCommandHandler, 
    GetUserByCLSQueryHandler, 
    AddCompanyUserGroupCommandHandler, 
    RemoveCompanyUserGroupCommandHandler,
    UsersService]
})
export class UsersModule { }
