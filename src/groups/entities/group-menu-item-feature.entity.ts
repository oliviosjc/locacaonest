import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Group } from "./group.entity";
import { MenuItem } from "../../menu/entities/menu-item.entity";
import { MenuItemFeature } from "../../menu/entities/menu-item-feature.entity";

@Entity('group_menu_item_features')
export class GroupMenuItemFeature
{
    @PrimaryColumn('uuid')
    groupId: string;

    @PrimaryColumn('uuid')
    menuItemId: string;

    @PrimaryColumn('uuid')
    menuItemFeatureId: string;

    @ManyToOne(() => Group, group => group.groupMenuItemFeatures)
    group: Group;

    @ManyToOne(() => MenuItem, menuItem => menuItem.groupMenuItems)
    menuItem: MenuItem;

    @ManyToOne(() => MenuItemFeature, menuItemFeature => menuItemFeature.groupMenuItemFeatures)
    menuItemFeature: MenuItemFeature;
}