import { Column, Entity, ManyToOne } from "typeorm";
import { Model } from "./model.entity";
import { CategoryTechnicalInformation } from "../categories/category-technical-information.entity";

@Entity('model_category_technical_information_answers')
export class ModelCategoryTechnicalInformationAnswer
{
    @ManyToOne(() => CategoryTechnicalInformation, cti => cti.technicalInformationAnswers)
    CategoryTechnicalInformation: CategoryTechnicalInformation;

    @ManyToOne(() => Model, model => model.technicalInformationAnswers)
    model: Model;

    @Column({ 'type': 'varchar', length: 32, nullable: false })
    value: string;
}