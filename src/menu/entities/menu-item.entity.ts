import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { MenuItemFeature } from "./menu-item-feature.entity";
import { GroupMenuItemFeature } from "../../groups/entities/group-menu-item-feature.entity";

@Entity('menus')
export class MenuItem 
{
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  icon: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  link: string | null;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => MenuItem, (menu) => menu.sub, { nullable: true })
  parent: MenuItem;

  @OneToMany(() => MenuItem, (menu) => menu.parent)
  sub: MenuItem[];

  @OneToMany(() => MenuItemFeature, MenuItemFeature => MenuItemFeature.menuItem)
  features: MenuItemFeature[];

  @OneToMany(() => GroupMenuItemFeature, (groupMenuItem) => groupMenuItem.menuItem)
  groupMenuItems: GroupMenuItemFeature[];
}