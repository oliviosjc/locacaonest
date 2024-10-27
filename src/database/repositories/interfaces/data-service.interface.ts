import { User } from "src/users/entities/user.entity";
import { IGenericRepository } from "./repository.interface";

export abstract class IDataService {
  users: IGenericRepository<User>;
}
