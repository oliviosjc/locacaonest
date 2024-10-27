import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdateGroupCommand } from '../commands/update-group.command';
import { ResponseViewModel } from 'src/utils/response.model';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { HttpStatus } from '@nestjs/common';
import { GetUserByCLSQuery } from 'src/users/queries/get-user-by-cls.query';
import { User } from 'src/users/entities/user.entity';

@CommandHandler(UpdateGroupCommand)
export class UpdateGroupCommandHandler
  implements ICommandHandler<UpdateGroupCommand>
{
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(
    command: UpdateGroupCommand,
  ): Promise<ResponseViewModel<string>> {
    const user = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

    if (user === null)
      return new ResponseViewModel(
        HttpStatus.BAD_REQUEST,
        'Não foi possível buscar informações do usuário logado.',
      );

    const group = await this.dataService.groups.findOne({
      where: { id: command.id },
      relations: ['owner'],
    });

    if (group === null)
      return new ResponseViewModel(
        HttpStatus.BAD_REQUEST,
        'Grupo não encontrado com este Id!',
      );

    if (group.owner.id !== user.id)
      return new ResponseViewModel(
        HttpStatus.FORBIDDEN,
        'Você não possui permissão para editar este grupo!',
      );

    group.name = command.name.toUpperCase();
    group.updatedBy = user.email;
    group.updatedAt = new Date();

    await this.dataService.groups.save(group);
    return new ResponseViewModel(
      HttpStatus.OK,
      'Grupo atualizado com sucesso!',
    );
  }
}
