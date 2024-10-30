import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdateGroupCommand } from '../commands/update-group.command';
import { ResponseViewModel } from '../../utils/response.model';
import { IDataService } from '../../database/repositories/interfaces/data-service.interface';
import { HttpStatus } from '@nestjs/common';
import { GetUserByCLSQuery } from '../../users/queries/get-user-by-cls.query';
import { User } from '../../users/entities/user.entity';

@CommandHandler(UpdateGroupCommand)
export class UpdateGroupCommandHandler
  implements ICommandHandler<UpdateGroupCommand> {
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus,
  ) { }
  async execute(command: UpdateGroupCommand) : Promise<ResponseViewModel<string>> {
    const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;

    if (!userLogged)
      return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'O Usuário não está autenticado!');

    const group 
    = await this.dataService.groups.findOne({ where: { id: command.id }, relations: ['owner']});

    if (group === null)
      return new ResponseViewModel(HttpStatus.BAD_REQUEST, 'O grupo informado não existe na base de dados!');

    if (group.owner.id !== userLogged.id)
      return new ResponseViewModel(HttpStatus.FORBIDDEN, 'Vocé não possui permissão para atualizar este grupo!');

    group.name = command.name.toUpperCase();
    group.updatedBy = userLogged.email;
    group.updatedAt = new Date();

    await this.dataService.groups.save(group);

    return new ResponseViewModel<string>(HttpStatus.OK, 'O grupo foi atualizado com sucesso!');
  }
}
