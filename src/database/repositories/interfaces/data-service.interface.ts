import { User } from "../../../users/entities/user.entity";
import { IGenericRepository } from "./repository.interface";
import { Group } from "../../../groups/entities/group.entity";
import { CompanyUserGroup } from "../../../companies/entities/company-user-group.entity";
import { Company } from "../../../companies/entities/company.entity";
import { MenuItemFeature } from "../../../menu/entities/menu-item-feature.entity";
import { GroupMenuItemFeature } from "../../../groups/entities/group-menu-item-feature.entity";
import { MenuItem } from "../../../menu/entities/menu-item.entity";
import { Brand } from "../../../backoffice/entities/brand.entity";
import { Category } from "../../../backoffice/entities/category.entity";
import { Model } from "../../..//backoffice/entities/model.entity";
import { Customer } from "../../../backoffice/entities/customers/customer.entity";
import { CustomerAddress } from "../../../backoffice/entities/customers/customer-address.entity";
import { CustomerContact } from "../../../backoffice/entities/customers/customer-contact.entity";

export abstract class IDataService {
  users: IGenericRepository<User>;
  groups: IGenericRepository<Group>;
  companyUserGroups: IGenericRepository<CompanyUserGroup>;
  companies: IGenericRepository<Company>;
  menuItems: IGenericRepository<MenuItem>;
  menuItemFeatures: IGenericRepository<MenuItemFeature>;
  groupMenuItemFeatures: IGenericRepository<GroupMenuItemFeature>;
  brands: IGenericRepository<Brand>;
  categories: IGenericRepository<Category>;
  models: IGenericRepository<Model>;
  customers: IGenericRepository<Customer>;
  customerAddresses: IGenericRepository<CustomerAddress>;
  customerContacts: IGenericRepository<CustomerContact>;
}
