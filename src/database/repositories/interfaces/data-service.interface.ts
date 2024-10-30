import { User } from "../../../users/entities/user.entity";
import { IGenericRepository } from "./repository.interface";
import { Group } from "../../../groups/entities/group.entity";
import { CompanyUserGroup } from "../../../companies/entities/company-user-group.entity";
import { Company } from "../../../companies/entities/company.entity";
import { MenuItemFeature } from "../../../menu/entities/menu-item-feature.entity";
import { GroupMenuItemFeature } from "../../../groups/entities/group-menu-item-feature.entity";
import { MenuItem } from "../../../menu/entities/menu-item.entity";
import { Model } from "../../../backoffice/entities/models/model.entity";
import { Customer } from "../../../backoffice/entities/customers/customer.entity";
import { CustomerAddress } from "../../../backoffice/entities/customers/customer-address.entity";
import { CustomerContact } from "../../../backoffice/entities/customers/customer-contact.entity";
import { Brand } from "../../../backoffice/entities/brands/brand.entity";
import { Category } from "../../../backoffice/entities/categories/category.entity";
import { CustomerDocumentConfiguration } from "../../../backoffice/entities/customers/customer-document-configuration.entity";
import { CustomerDocument } from "../../../backoffice/entities/customers/customer-document.entity";
import { CategoryTechnicalInformation } from "../../../backoffice/entities/categories/category-technical-information.entity";
import { ModelCategoryTechnicalInformationAnswer } from "../../../backoffice/entities/models/model-category-technical-information-answer.entity";

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
  categoryTechnicalInformations: IGenericRepository<CategoryTechnicalInformation>;
  models: IGenericRepository<Model>;
  modelCategoryTechnicalInformationAnswers: IGenericRepository<ModelCategoryTechnicalInformationAnswer>;
  customers: IGenericRepository<Customer>;
  customerAddresses: IGenericRepository<CustomerAddress>;
  customerContacts: IGenericRepository<CustomerContact>;
  customerDocumentConfigurations: IGenericRepository<CustomerDocumentConfiguration>;
  customerDocuments: IGenericRepository<CustomerDocument>;
}
