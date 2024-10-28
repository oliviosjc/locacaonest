import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GroupsController } from './groups.controller';
import { CreateGroupCommandHandler } from './handlers/create-group.handler';
import { AuthModule } from '../auth/auth.module';
import { UpdateGroupCommandHandler } from './handlers/update-group.handler';
import { AddGroupMenuItemFeatureCommandHandler } from './handlers/add-group-menu-item-feature.handler';
import { RemoveGroupMenuItemFeatureCommandHandler } from './handlers/remove-group-menu-item-feature.handler';

@Module({
    imports: [CqrsModule, AuthModule],
    providers: [CreateGroupCommandHandler, 
        UpdateGroupCommandHandler, 
        AddGroupMenuItemFeatureCommandHandler,
        RemoveGroupMenuItemFeatureCommandHandler],
    controllers: [GroupsController]
})
export class GroupsModule {}
