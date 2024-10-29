import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../utils/base.entity";
import { Model } from "./model.entity";
import { User } from "../../users/entities/user.entity";

@Entity('brands')
export class Brand extends BaseEntity
{
    @Column({ type: 'varchar', length: 128, nullable: false })
    name: string;

    @Column({type: 'varchar', length: 128, nullable: false})
    description: string;

    @Column({type: 'varchar', length: 512, nullable: true})
    image: string;

    @OneToMany(() => Model, model => model.brand)
    models: Model[];

    @ManyToOne(() => User, user => user.brands)
    owner: User;
}