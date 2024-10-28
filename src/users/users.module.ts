import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserCommandHandler } from './handlers/create-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserByCLSQueryHandler } from './handlers/get-user-by-cls.handler';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [UsersController],
  providers: [CreateUserCommandHandler, GetUserByCLSQueryHandler, UsersService]
})
export class UsersModule {}
