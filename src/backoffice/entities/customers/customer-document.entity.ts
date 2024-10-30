import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { CustomerDocumentConfiguration } from "./customer-document-configuration.entity";
import { Customer } from "./customer.entity";

@Entity('customer_documents')
export class CustomerDocument
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column({type: 'varchar', length: 128, nullable: false})
    filename: string;

    @Column({type: 'varchar', length: 128, nullable: false})
    extension: string;

    @Column({type: 'varchar', length: 1024, nullable: false})
    s3Path: string;

    @ManyToOne(() => Customer, customer => customer.documents)
    customer: Customer;

    @ManyToOne(() => CustomerDocumentConfiguration, customerDocumentConfiguration => customerDocumentConfiguration.customerDocuments)
    customerDocumentConfiguration: CustomerDocumentConfiguration;
}