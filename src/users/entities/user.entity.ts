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

import { Group } from '../../groups/entities/group.entity';
import { UserStatus } from '../enumerators/user-status.enumerator';
import { Brand } from '../../backoffice/entities/brand.entity';
import { Category } from '../../backoffice/entities/category.entity';
import { Model } from '../../backoffice/entities/model.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 128, nullable: false })
  fullName: string;

  @Column({ type: 'varchar', length: 128, nullable: false, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    nullable: true
  })
  status: UserStatus;

  @Column({ type: 'varchar', length: 14, nullable: true })
  document: string;

  @OneToMany(() => User, (user) => user.owner)
  subUsers: User[];

  @ManyToOne(() => User, (user) => user.subUsers, { nullable: true })
  owner: User;

  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];

  @OneToMany(() => CompanyUserGroup, companyUserGroup => companyUserGroup.user)
  companyUserGroups: CompanyUserGroup[];

  @OneToMany(() => Group, (group) => group.owner)
  groups: Group[];

  @OneToMany(() => Brand, (brand) => brand.owner)
  brands: Brand[];
  
  @OneToMany(() => Category, (category) => category.owner)
  categories: Category[];

  @OneToMany(() => Model, (model) => model.owner)
  models: Model[];

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
