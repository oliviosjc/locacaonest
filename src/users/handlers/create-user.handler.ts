import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { ResponseViewModel } from 'src/utils/response.model';
import { IDataService } from '../../database/repositories/interfaces/data-service.interface';
import { User } from '../entities/user.entity';
import { GetUserByCLSQuery } from '../queries/get-user-by-cls.query';
import { UsersService } from '../users.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus,
    private readonly userService: UsersService
  ) {}

  async execute(command: CreateUserCommand): Promise<ResponseViewModel<string>> {
    const { email, fullName, password, groupId, companyId } = command;

    const existentUser = await this.checkIfUserExists(email);
    if (existentUser) {
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O email informado já existe na base de dados!');
    }

    const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
    if (!userLogged) {
      return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'Usuário não autenticado!');
    }

    const owner = userLogged.owner || userLogged;

    const group = await this.getEntityWithOwner(this.dataService.groups, groupId, 'O grupo informado não existe na base de dados!');
    if (!group || group.owner.id !== owner.id) {
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para criar um usuário na base de dados!');
    }

    const company = await this.getEntityWithOwner(this.dataService.companies, companyId, 'A empresa informada não existe na base de dados!');
    if (!company || company.owner.id !== owner.id) {
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, ' Vocé não possui permissão para criar um usuário na base de dados!');
    }

    const hasPermission = await this.userService
    .verifyUserCompanyGroupHandler(userLogged.id, group, company, this.dataService, 'CreateUserCommandHandler');

    if (!hasPermission) {
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para criar um usuário na base de dados!');
    }

    await this.createUser({ fullName, email, password, owner, createdBy: userLogged.email });

    return new ResponseViewModel<string>(HttpStatus.CREATED, 'Usuário criado com sucesso!');
  }

  private async checkIfUserExists(email: string): Promise<boolean> {
    return !!(await this.dataService.users.findOne({ where: { email } }));
  }

  private async getEntityWithOwner(repository, id: string, errorMessage: string): Promise<any> {
    const entity = await repository.findOne({ where: { id }, relations: ['owner'] });
    if (!entity) {
      throw new ResponseViewModel(HttpStatus.BAD_REQUEST, errorMessage);
    }
    return entity;
  }

  private async createUser({ fullName, email, password, owner, createdBy }: { fullName: string, email: string, password: string, owner: User, createdBy: string }): Promise<void> {
    const newUser = this.dataService.users.create({
      fullName: fullName.toUpperCase(),
      email,
      password,
      actived: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
      updatedBy: createdBy,
      owner,
    });
    
    await this.dataService.users.save(newUser);
  }
}
