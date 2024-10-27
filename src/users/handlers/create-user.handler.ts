import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { ResponseViewModel } from 'src/utils/response.model';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { User } from '../entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(private readonly dataService: IDataService) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<ResponseViewModel<string>> {
    
    var nUser = new User();
    nUser.fullName = command.fullName.toUpperCase();
    nUser.password = command.password;
    nUser.email = command.email;
    nUser.actived = true;
    nUser.createdAt = new Date();
    nUser.updatedAt = new Date();
    nUser.createdBy = 'system_user';
    nUser.updatedBy = 'system_user';

    await this.dataService.users.save(nUser);
    return new ResponseViewModel(
      HttpStatus.CREATED,
      'Usuário cadastrado com sucesso na base de dados!',
      command.email,
    );
  }
}
