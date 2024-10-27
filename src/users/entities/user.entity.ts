import { compare, hash } from 'bcrypt';
import { CompanyUserGroup } from '../../companies/entities/company-user-group.entity';
import { Company } from '../../companies/entities/company.entity';
import { BaseEntity } from '../../utils/base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 128, nullable: false })
  fullName: string;

  @Column({ type: 'varchar', length: 128, nullable: false, unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => User, (user) => user.owner)
  subUsers: User[];

  @ManyToOne(() => User, (user) => user.subUsers, { nullable: true })
  owner: User;

  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];

  @OneToMany(() => CompanyUserGroup, companyUserGroup => companyUserGroup.user)
  companyUserGroups: CompanyUserGroup[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}