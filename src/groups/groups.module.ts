import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GroupsController } from './groups.controller';
import { CreateGroupCommandHandler } from './handlers/create-group.handler';
import { AuthModule } from '../auth/auth.module';
import { UpdateGroupCommandHandler } from './handlers/update-group.handler';

@Module({
    imports: [CqrsModule, AuthModule],
    providers: [CreateGroupCommandHandler, UpdateGroupCommandHandler],
    controllers: [GroupsController]
})
export class GroupsModule {}
