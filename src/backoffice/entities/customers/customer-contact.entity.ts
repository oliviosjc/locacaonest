import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { v4 as uuidv4 } from 'uuid';

@Entity('customer_contacts')
export class CustomerContact
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column({ type: 'varchar', length: 128, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 128, nullable: false })
    position: string;

    @Column({ type: 'varchar', length: 128, nullable: true, unique: true })
    whatsapp: string;

    @Column({ type: 'varchar', length: 128, nullable: true, unique: true })
    email: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    systemCommunication: boolean;

    @ManyToOne(() => Customer, customer => customer.contacts)
    customer: Customer;
}