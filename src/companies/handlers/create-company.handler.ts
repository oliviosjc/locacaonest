import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CreateCompanyCommand } from '../commands/create-company.command';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { ResponseViewModel } from 'src/utils/response.model';
import { User } from '../../users/entities/user.entity';
import { GetUserByCLSQuery } from '../../users/queries/get-user-by-cls.query';
import { HttpStatus } from '@nestjs/common';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyCommandHandler implements ICommandHandler<CreateCompanyCommand> {
  constructor(
    private readonly dataService: IDataService,
    private readonly queryBus: QueryBus
  ) { }

  async execute(command: CreateCompanyCommand) : Promise<ResponseViewModel<string>> {
    const { socialName, fantasyName, document } = command;

    const userLogged = (await this.queryBus.execute(new GetUserByCLSQuery())) as User;
    if (!userLogged)
      return new ResponseViewModel<string>(HttpStatus.UNAUTHORIZED, 'Usuário não autenticado!');

    if (userLogged.owner !== null)
      return new ResponseViewModel<string>(HttpStatus.FORBIDDEN, 'Usuário não possui permissão para criar empresas!');

    const nCompany = await this.dataService.companies.create({
      socialName,
      fantasyName,
      document,
      owner: userLogged,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userLogged.email,
      updatedBy: userLogged.email
    });

    await this.dataService.companies.save(nCompany);

    return new ResponseViewModel<string>(HttpStatus.CREATED, 'Empresa criada com sucesso!');
  }
}
