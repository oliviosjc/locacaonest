import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from "./menu-item.entity";
import { GroupMenuItemFeature } from "../../groups/entities/group-menu-item-feature.entity";

@Entity('menu_item_features')
export class MenuItemFeature
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
    handler: string;

    @ManyToOne(() => MenuItem, (MenuItem) => MenuItem.features)
    menuItem: MenuItem;

    @OneToMany(() => GroupMenuItemFeature, groupMenuItemFeature => groupMenuItemFeature.menuItemFeature)
    groupMenuItemFeatures: GroupMenuItemFeature[];
}