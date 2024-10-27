// src/locacao.Domain/Entities/Backoffice/Companies/company-user-group.model.ts
import { User } from "../../users/entities/user.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Company } from "./company.entity";
import { Group } from "../../groups/entities/group.entity";

@Entity({name: 'companies_user_groups'})
export class CompanyUserGroup
{
    @PrimaryColumn('uuid')
    companyId: string;

    @PrimaryColumn('uuid')
    userId: string;

    @PrimaryColumn('uuid')
    groupId: string;

    @ManyToOne(() => User, user => user.companyUserGroups)
    user: User;

    @ManyToOne(() => Company, company => company.companyUserGroups)
    company: Company;

    @ManyToOne(() => Group, group => group.companyUserGroups)
    group: Group;
}