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
  implements ICommandHandler<CreateGroupCommand>
{
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    command: CreateGroupCommand,
  ): Promise<ResponseViewModel<string>> {
    const user = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

    if (user === null)
      return new ResponseViewModel(
        HttpStatus.BAD_REQUEST,
        'Não foi possível buscar informações do usuário logado.',
      );

    const nGroup = new Group();
    nGroup.name = command.name.toUpperCase();

    if (
      command.parentGroupId !== null &&
      command.parentGroupId !== '' &&
      command.parentGroupId !== undefined
    ) {
      const parentGroup = await this.dataService.groups.findOne({
        where: { id: command.parentGroupId },
      });

      if (parentGroup === null)
        return new ResponseViewModel(
          HttpStatus.BAD_REQUEST,
          'Grupo pai não encontrado!',
        );

      nGroup.parentGroup = parentGroup;
    }

    nGroup.owner = user;
    nGroup.createdBy = user.email;
    nGroup.createdAt = new Date();
    nGroup.updatedAt = new Date();
    nGroup.actived = true;

    await this.dataService.groups.save(nGroup);

    return new ResponseViewModel(
      HttpStatus.CREATED,
      'Grupo cadastrado com sucesso na base de dados!',
    );
  }
}