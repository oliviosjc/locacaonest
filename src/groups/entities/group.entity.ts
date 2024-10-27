import { BaseEntity } from "../../utils/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { GroupMenuItemFeature } from "./group-menu-item-feature.entity";
import { CompanyUserGroup } from "../../companies/entities/company-user-group.entity";
import { User } from "../../users/entities/user.entity";

@Entity('groups')
export class Group extends BaseEntity
{
    @Column({type: 'varchar', length: 128, nullable: false})
    name: string;

    @OneToMany(() => Group, group => group.parentGroup)
    subGroups: Group[];

    @ManyToOne(() => Group, group => group.subGroups, { nullable: true })
    parentGroup: Group;

    @OneToMany(() => CompanyUserGroup, companyUserGroup => companyUserGroup.group)
    companyUserGroups: CompanyUserGroup[];

    @OneToMany(() => GroupMenuItemFeature, groupMenuItemFeature => groupMenuItemFeature.group)
    groupMenuItemFeatures: GroupMenuItemFeature[];

    @ManyToOne(() => User, user => user.groups)
    owner: User
}