import { User } from "../../../users/entities/user.entity";
import { IGenericRepository } from "./repository.interface";
import { Group } from "../../../groups/entities/group.entity";
import { CompanyUserGroup } from "../../../companies/entities/company-user-group.entity";
import { Company } from "../../../companies/entities/company.entity";
import { MenuItemFeature } from "../../../menu/entities/menu-item-feature.entity";
import { GroupMenuItemFeature } from "../../../groups/entities/group-menu-item-feature.entity";
import { MenuItem } from "../../../menu/entities/menu-item.entity";

export abstract class IDataService {
  users: IGenericRepository<User>;
  groups: IGenericRepository<Group>;
  companyUserGroups: IGenericRepository<CompanyUserGroup>;
  companies: IGenericRepository<Company>;
  menuItems: IGenericRepository<MenuItem>;
  menuItemFeatures: IGenericRepository<MenuItemFeature>;
  groupMenuItemFeatures: IGenericRepository<GroupMenuItemFeature>;
}
