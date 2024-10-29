import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../utils/base.entity";
import { CustomerContact } from "./customer-contact.entity";
import { CustomerAddress } from "./customer-address.entity";

@Entity('customers')
export class Customer extends BaseEntity
{
    @Column({type: 'varchar', length: 128, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 14, nullable: false, unique: true})
    document: string;

    @OneToMany(() => CustomerContact, customerContact => customerContact.customer)
    contacts: CustomerContact[];

    @OneToMany(() => CustomerAddress, customerAddress => customerAddress.customer)
    addresses: CustomerAddress[];
}