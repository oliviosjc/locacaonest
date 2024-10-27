import { User } from "../../users/entities/user.entity";
import { BaseEntity } from "../../utils/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CompanyUserGroup } from "./company-user-group.entity";

@Entity('companies')
export class Company extends BaseEntity
{
    @Column({type: 'varchar', length: 128, nullable: false})
    socialName: string;

    @Column({type: 'varchar', length: 128, nullable: false})
    fantasyName: string;

    @Column({type: 'varchar', length: 14, nullable: false, unique: true})
    document: string;

    @ManyToOne(() => User, user => user.companies)
    owner: User;

    @OneToMany(() => CompanyUserGroup, companyUserGroup => companyUserGroup.company)
    companyUserGroups: CompanyUserGroup[];
}