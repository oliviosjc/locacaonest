import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { ModelCategoryTechnicalInformationAnswer } from "../models/model-category-technical-information-answer.entity";
import { FieldType } from "../../../backoffice/enumerators/field-type.enumerator";
import { v4 as uuidv4 } from 'uuid';

@Entity('categorys_technical_informations')
export class CategoryTechnicalInformation
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @ManyToOne(() => Category, category => category.categoryTechnicalInformations)
    category: Category;

    @Column({ 'type': 'enum', enum: FieldType, nullable: false, default: FieldType.TEXT })
    fieldType: FieldType;

    @Column({ 'type': 'varchar', length: 128, nullable: false })
    key: string;

    @Column({ nullable: false, default: false })
    required: boolean;

    @Column({ nullable: false, default: 0 })
    order: number;

    @OneToMany(() => ModelCategoryTechnicalInformationAnswer, cti => cti.CategoryTechnicalInformation)
    technicalInformationAnswers: ModelCategoryTechnicalInformationAnswer[];
}