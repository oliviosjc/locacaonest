import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { ResponseViewModel } from 'src/utils/response.model';
import { Group } from '../entities/group.entity';
import { HttpStatus } from '@nestjs/common';
import { CreateGroupCommand } from '../commands/create-group.command';
import { GetUserByCLSQuery } from 'src/users/queries/get-user-by-cls.query';
import { User } from 'src/users/entities/user.entity';

@CommandHandler(CreateGroupCommand)
export class CreateGroupCommandHandler
  implements ICommandHandler<CreateGroupCommand> {
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus,
  ) { }

  async execute(command: CreateGroupCommand): Promise<ResponseViewModel<string>> {
    const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

    if (!userLogged)
      return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

    if(userLogged.owner !== null)
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'O Usuário não possui permissão para criar grupos!');

    let parentGroup : Group = null;

    if(command.parentGroupId !== null)
    {
      parentGroup = await this.dataService.groups.findOne({
        where: { id: command.parentGroupId }
      });

      if(parentGroup === null)
        return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'O grupo pai informado não existe na base de dados!');
    }

    const group = await this.dataService.groups.create({
      name: command.name,
      owner: userLogged,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userLogged.email,
      updatedBy: userLogged.email,
      parentGroup: parentGroup,
      actived: true
    });

    await this.dataService.groups.save(group);

    return new ResponseViewModel<string>(HttpStatus.CREATED, 'Grupo criado com sucesso!');
  }
} 