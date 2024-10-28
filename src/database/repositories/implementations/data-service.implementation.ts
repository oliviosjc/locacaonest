import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { IDataService } from '../interfaces/data-service.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { User } from '../../../users/entities/user.entity';
import { GenericRepository } from './repository.implementation';
import { Group } from '../../../groups/entities/group.entity';
import { CompanyUserGroup } from '../../../companies/entities/company-user-group.entity';
import { Company } from '../../../companies/entities/company.entity';

@Injectable()
export class GenericDataService
  implements IDataService, OnApplicationBootstrap
{
  users: IGenericRepository<User>;
  groups: IGenericRepository<Group>;
  companyUserGroups: IGenericRepository<CompanyUserGroup>;
  companies: IGenericRepository<Company>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: IGenericRepository<User>,
    @InjectRepository(Group) private readonly groupRepository: IGenericRepository<Group>,
    @InjectRepository(CompanyUserGroup) private readonly companyUserGroupRepository: IGenericRepository<CompanyUserGroup>, 
    @InjectRepository(Company) private readonly companyRepository: IGenericRepository<Company>,
  ) {}

  onApplicationBootstrap() {
    this.users = new GenericRepository<User>(
      User,
      this.entityManager,
      this.userRepository.queryRunner,
    );

    this.groups = new GenericRepository<Group>(
      Group,
      this.entityManager,
      this.groupRepository.queryRunner,
    );

    this.companyUserGroups = new GenericRepository<CompanyUserGroup>(
      CompanyUserGroup,
      this.entityManager,
      this.companyUserGroupRepository.queryRunner,
    );

    this.companies = new GenericRepository<Company>(
      Company,
      this.entityManager,
      this.companyRepository.queryRunner,
    );
  }
}