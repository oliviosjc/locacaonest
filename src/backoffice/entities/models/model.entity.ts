import { BaseEntity } from "../../../utils/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Brand } from "../brands/brand.entity";
import { Category } from "../categories/category.entity";
import { User } from "../../../users/entities/user.entity";

@Entity('models')
export class Model extends BaseEntity
{
    @Column({type: 'varchar', length: 128, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 128, nullable: false})
    description: string;

    @Column({type: 'varchar', length: 128, nullable: true})
    image: string;

    @ManyToOne(() => Brand, brand => brand.models)
    brand: Brand;

    @ManyToOne(() => Category, category => category.models)
    category: Category;

    @ManyToOne(() => User, user => user.models)
    owner: User;
}