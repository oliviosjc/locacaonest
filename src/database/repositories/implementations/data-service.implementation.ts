import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { IDataService } from '../interfaces/data-service.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { User } from '../../../users/entities/user.entity';
import { GenericRepository } from './repository.implementation';
import { Group } from '../../../groups/entities/group.entity';

@Injectable()
export class GenericDataService
  implements IDataService, OnApplicationBootstrap
{
  users: IGenericRepository<User>;
  groups: IGenericRepository<Group>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: IGenericRepository<User>,
    @InjectRepository(Group) private readonly groupRepository: IGenericRepository<Group>,
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
  }
}