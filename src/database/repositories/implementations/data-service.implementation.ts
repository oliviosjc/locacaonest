import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IDataService } from '../interfaces/data-service.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { User } from '../../../users/entities/user.entity';
import { GenericRepository } from './repository.implementation';

@Injectable()
export class GenericDataService
  implements IDataService, OnApplicationBootstrap
{
  users: IGenericRepository<User>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: IGenericRepository<User>,
  ) {}

  onApplicationBootstrap() {
    this.users = new GenericRepository<User>(
      User,
      this.entityManager,
      this.userRepository.queryRunner,
    );
  }
}