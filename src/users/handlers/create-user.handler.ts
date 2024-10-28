import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { HttpStatus } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { ResponseViewModel } from 'src/utils/response.model';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { User } from '../entities/user.entity';
import { GetUserByCLSQuery } from '../queries/get-user-by-cls.query';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<ResponseViewModel<string>> 
  {
    const existentUser = await this.dataService.users.findOne({
      where: {
        email: command.email,
      },
    });

    if (existentUser !== null)
      return new ResponseViewModel(
        HttpStatus.BAD_REQUEST,
        'Usuário ja existe na base de dados com este e-mail!',
      );
    
    const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
    
    if(userLogged === null)
      return new ResponseViewModel
      (
        HttpStatus.BAD_REQUEST,
        'Não foi possível buscar informações do usuário logado!',
      );
    
    var owner = null as User;

    if(userLogged.owner !== null)
      owner = userLogged.owner;
    else
      owner = userLogged;

    const nUser = new User();
    nUser.fullName = command.fullName.toUpperCase();
    nUser.password = command.password;
    nUser.email = command.email;
    nUser.actived = true;
    nUser.createdAt = new Date();
    nUser.updatedAt = new Date();
    nUser.createdBy = userLogged.email;
    nUser.updatedBy = userLogged.email;
    nUser.owner = owner;
    
    await this.dataService.users.save(nUser);
    return new ResponseViewModel(
      HttpStatus.CREATED,
      'Usuário cadastrado com sucesso na base de dados!',
      command.email,
    );
  }
}