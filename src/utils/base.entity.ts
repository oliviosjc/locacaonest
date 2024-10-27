import { Column, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class BaseEntity 
{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt : Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
    updatedAt : Date | null;

    @Column({type: 'varchar', length: 128, nullable: false})  
    createdBy: string;

    @Column({type: 'varchar', length: 128, nullable: true})
    updatedBy: string;

    @Column({type: 'boolean', default: true})	
    actived: boolean;
}