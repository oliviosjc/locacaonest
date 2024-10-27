import { Repository } from "typeorm";

export abstract class IGenericRepository<T> extends Repository<T> {}
