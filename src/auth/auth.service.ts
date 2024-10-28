import { HttpStatus, Injectable } from '@nestjs/common';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';
import { ResponseViewModel } from 'src/utils/response.model';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserDTO } from './dto/user.dto';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataService: IDataService,
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<ResponseViewModel<string>> {
    const user = await this.dataService.users.findOne({
      where: { email: email },
      relations: ['owner'],
    });

    if (user && (await compare(password, user.password))) {
      const { password, ...result } = user;

      const payload = {
        email: result.email,
        sub: result.id,
        ownerId: result.owner ? result.owner.id : null,
      };

      return new ResponseViewModel(
        HttpStatus.OK,
        'Login efetuado com sucesso!',
        this.jwtService.sign(payload),
      );
    } else
      return new ResponseViewModel(
        HttpStatus.FORBIDDEN,
        'Email ou senha inválidos!',
      );
  }

  async getCLSUser(): Promise<UserDTO> 
  {
    const user = this.clsService.get('user');
    const dto = new UserDTO();
    dto.email = user.email;
    dto.id = user.sud;
    dto.ownerId = user.ownerId;
    return dto;
  }
}
