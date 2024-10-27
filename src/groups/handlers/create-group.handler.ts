import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { ResponseViewModel } from 'src/utils/response.model';
import { Group } from '../entities/group.entity';
import { HttpStatus } from '@nestjs/common';
import { CreateGroupCommand } from '../commands/create-group.command';
import { ClsService } from 'nestjs-cls';

@CommandHandler(CreateGroupCommand)
export class CreateGroupCommandHandler
  implements ICommandHandler<CreateGroupCommand>
{
  constructor(
    private readonly dataService: IDataService,
    private readonly clsService: ClsService,
  ) {}

  async execute(
    command: CreateGroupCommand,
  ): Promise<ResponseViewModel<string>> 
  {
    const user = this.clsService.get('user');

    const nGroup = new Group();
    nGroup.name = command.name.toUpperCase();

    if (
      command.parentGroupId !== null &&
      command.parentGroupId !== '' &&
      command.parentGroupId !== undefined
    ) 
    {
      const parentGroup = await this.dataService.groups.findOne({
        where: { id: command.parentGroupId }});

      if (parentGroup === null)
        return new ResponseViewModel(
          HttpStatus.BAD_REQUEST,
          'Grupo pai não encontrado!',
        );

      nGroup.parentGroup = parentGroup;
    }

    nGroup.createdAt = new Date();
    nGroup.updatedAt = new Date();
    nGroup.createdBy = user.email;
    nGroup.actived = true;

    await this.dataService.groups.save(nGroup);

    return new ResponseViewModel(
      HttpStatus.CREATED,
      'Grupo cadastrado com sucesso na base de dados!',
    );
  }
}
