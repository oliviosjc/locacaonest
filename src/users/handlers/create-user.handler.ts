import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { HttpStatus } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { ResponseViewModel } from '../../utils/response.model';
import { IDataService } from '../../database/repositories/interfaces/data-service.interface';
import { User } from '../entities/user.entity';
import { GetUserByCLSQuery } from '../queries/get-user-by-cls.query';
import { UsersService } from '../users.service';
import { DocumentHelper } from '../../utils/document.helper';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus,
    private readonly userService: UsersService
  ) { }

  async execute(command: CreateUserCommand): Promise<ResponseViewModel<string>> {
    const { email, fullName, password, groupId, companyId, document } = command;

    let documentISValid = true;
    if (document.length == 11)
      documentISValid = DocumentHelper.validateCPF(document);
    else if (document.length !== 14)
      documentISValid = false;

    if (!documentISValid)
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O documento inserido é inválido!');

    const existentUser = await this.checkIfUserExists(email);
    if (existentUser)
      return new ResponseViewModel<string>(HttpStatus.BAD_REQUEST, 'O email informado já está cadastrado na base de dados!');

    const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
    if (!userLogged)
      return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

    const owner = userLogged.owner || userLogged;

    const group = await this.getEntityWithOwner(this.dataService.groups, groupId, 'O grupo informado não existe na base de dados!');
    if (!group || group.owner.id !== owner.id)
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Você não possui permissão para vincular usuários a este grupo.');

    const company = await this.getEntityWithOwner(this.dataService.companies, companyId, 'A compania informada não existe na base de dados!');
    if (!company || company.owner.id !== owner.id)
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, ' Vocé não possui permissão para vincular usuários a esta compania.');

    let hasPermission = false;

    if (userLogged.id === group.owner.id
      && userLogged.id === company.owner.id)
      hasPermission = true;
    else
      hasPermission = await this.userService.hasUserPermission(userLogged.id, company.id, 'CreateUserCommandHandler', this.dataService);

    if (hasPermission === false)
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para criar usuários para este grupo/compania.');

    const nUser = await this.createUser({ fullName, email, password, owner, createdBy: userLogged.email });
    await this.createCompanyUserGroup(nUser.id, group.id, company.id);

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

  private async createUser({ fullName, email, password, owner, createdBy }: { fullName: string, email: string, password: string, owner: User, createdBy: string }): Promise<User> {
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
    return newUser;
  }

  private async createCompanyUserGroup(userId: string, groupId: string, companyId: string): Promise<void> {
    const nCompanyUserGroup = await this.dataService.companyUserGroups.create(
      {
        userId: userId,
        groupId: groupId,
        companyId: companyId
      }
    );

    await this.dataService.companyUserGroups.save(nCompanyUserGroup);
  }
}