import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserCommandHandler } from './handlers/create-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserByCLSQueryHandler } from './handlers/get-user-by-cls.handler';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [UsersController],
  providers: [CreateUserCommandHandler, GetUserByCLSQueryHandler]
})
export class UsersModule {}
