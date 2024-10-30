import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "./model.entity";
import { CategoryTechnicalInformation } from "../categories/category-technical-information.entity";
import { v4 as uuidv4 } from 'uuid';

@Entity('model_category_technical_information_answers')
export class ModelCategoryTechnicalInformationAnswer
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @ManyToOne(() => CategoryTechnicalInformation, cti => cti.technicalInformationAnswers)
    CategoryTechnicalInformation: CategoryTechnicalInformation;

    @ManyToOne(() => Model, model => model.technicalInformationAnswers)
    model: Model;

    @Column({ 'type': 'varchar', length: 32, nullable: false })
    value: string;
}