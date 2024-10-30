import { User } from "../../../users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { CustomerDocument } from "./customer-document.entity";

@Entity('customer_document_configurations')
export class CustomerDocumentConfiguration
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column({type: 'varchar', length: 128, nullable: false})
    name: string;

    @Column({nullable: false})
    order: number;

    @Column({nullable: false})
    required: boolean;

    @ManyToOne(() => User, user => user.customerDocumentConfigurations)
    owner: User;

    @OneToMany(() => CustomerDocument, customerDocument => customerDocument.customerDocumentConfiguration)
    customerDocuments: CustomerDocument[];
}