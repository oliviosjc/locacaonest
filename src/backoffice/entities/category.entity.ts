import { BaseEntity } from "../../utils/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Model } from "./model.entity";
import { User } from "../../users/entities/user.entity";

@Entity('categories')
export class Category extends BaseEntity
{
    @Column({type: 'varchar', length: 128, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 128, nullable: false})
    description: string;

    @OneToMany(() => Model, model => model.category)
    models: Model[];

    @ManyToOne(() => User, user => user.categories)
    owner: User;
}