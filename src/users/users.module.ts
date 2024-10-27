import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserCommandHandler } from './handlers/create-user.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [CreateUserCommandHandler]
})
export class UsersModule {}
