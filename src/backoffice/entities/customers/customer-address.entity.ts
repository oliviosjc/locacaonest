import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { v4 as uuidv4 } from 'uuid';

@Entity('customer_addresses')
export class CustomerAddress 
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();
    
    @Column({ type: 'varchar', length: 128, nullable: false })
    address: string;

    @Column({ type: 'varchar', length: 128, nullable: false })
    city: string;   

    @Column({ type: 'varchar', length: 64, nullable: true })
    complement: string;

    @Column({ type: 'varchar', length: 64, nullable: false })
    state: string;

    @Column({ type: 'varchar', length: 8, nullable: false })
    zipCode: string;

    @Column({ type: 'varchar', length: 128, nullable: false })
    neighborhood: string;

    @Column({ type: 'varchar', length: 5, nullable: false })
    number: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    reference: string;

    @ManyToOne(() => Customer, customer => customer.addresses)
    customer: Customer;
}