import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GroupsController } from './groups.controller';
import { CreateGroupCommandHandler } from './handlers/create-group.handler';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [CqrsModule, AuthModule],
    providers: [CreateGroupCommandHandler],
    controllers: [GroupsController]
})
export class GroupsModule {}
