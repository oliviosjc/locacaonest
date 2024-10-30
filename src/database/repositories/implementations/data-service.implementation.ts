import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IDataService } from '../interfaces/data-service.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { User } from '../../../users/entities/user.entity';
import { GenericRepository } from './repository.implementation';
import { Group } from '../../../groups/entities/group.entity';
import { CompanyUserGroup } from '../../../companies/entities/company-user-group.entity';
import { Company } from '../../../companies/entities/company.entity';
import { MenuItemFeature } from '../../../menu/entities/menu-item-feature.entity';
import { GroupMenuItemFeature } from '../../../groups/entities/group-menu-item-feature.entity';
import { MenuItem } from '../../../menu/entities/menu-item.entity';
import { Customer } from '../../../backoffice/entities/customers/customer.entity';
import { Model } from '../../../backoffice/entities/models/model.entity';
import { CustomerAddress } from '../../../backoffice/entities/customers/customer-address.entity';
import { CustomerContact } from '../../../backoffice/entities/customers/customer-contact.entity';
import { Brand } from '../../../backoffice/entities/brands/brand.entity';
import { Category } from '../../../backoffice/entities/categories/category.entity';
import { CustomerDocumentConfiguration } from '../../../backoffice/entities/customers/customer-document-configuration.entity';
import { CustomerDocument } from '../../../backoffice/entities/customers/customer-document.entity';

@Injectable()
export class GenericDataService
  implements IDataService, OnApplicationBootstrap
{
  users: IGenericRepository<User>;
  groups: IGenericRepository<Group>;
  companyUserGroups: IGenericRepository<CompanyUserGroup>;
  companies: IGenericRepository<Company>;
  menuItems: IGenericRepository<MenuItem>;
  menuItemFeatures: IGenericRepository<MenuItemFeature>;
  groupMenuItemFeatures: IGenericRepository<GroupMenuItemFeature>;
  brands: IGenericRepository<Brand>;
  categories: IGenericRepository<Category>;
  customers: IGenericRepository<Customer>;
  models: IGenericRepository<Model>;
  customerAddresses: IGenericRepository<CustomerAddress>;
  customerContacts: IGenericRepository<CustomerContact>;
  customerDocumentConfigurations: IGenericRepository<CustomerDocumentConfiguration>;
  customerDocuments: IGenericRepository<CustomerDocument>;
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: IGenericRepository<User>,
    @InjectRepository(Group) private readonly groupRepository: IGenericRepository<Group>,
    @InjectRepository(CompanyUserGroup) private readonly companyUserGroupRepository: IGenericRepository<CompanyUserGroup>, 
    @InjectRepository(Company) private readonly companyRepository: IGenericRepository<Company>,
    @InjectRepository(MenuItem) private readonly menuItemRepository: IGenericRepository<MenuItem>,
    @InjectRepository(MenuItemFeature) private readonly menuItemFeatureRepository: IGenericRepository<MenuItemFeature>,
    @InjectRepository(GroupMenuItemFeature) private readonly groupMenuItemFeatureRepository: IGenericRepository<GroupMenuItemFeature>,
    @InjectRepository(Brand) private readonly brandRepository: IGenericRepository<Brand>,
    @InjectRepository(Category) private readonly categoryRepository: IGenericRepository<Category>,
    @InjectRepository(Customer) private readonly customerRepository: IGenericRepository<Customer>,
    @InjectRepository(CustomerAddress) private readonly customerAddressRepository: IGenericRepository<CustomerAddress>,
    @InjectRepository(CustomerContact) private readonly customerContactRepository: IGenericRepository<CustomerContact>,
    @InjectRepository(CustomerDocumentConfiguration) private readonly customerDocumentConfigurationRepository: IGenericRepository<CustomerDocumentConfiguration>,
    @InjectRepository(CustomerDocument) private readonly customerDocumentRepository: IGenericRepository<CustomerDocument>,
    @InjectRepository(Model) private readonly modelRepository: IGenericRepository<Model>,
  ) {}


  onApplicationBootstrap() {
    this.users = new GenericRepository<User>(
      User,
      this.entityManager,
      this.userRepository.queryRunner,
    );

    this.groups = new GenericRepository<Group>(
      Group,
      this.entityManager,
      this.groupRepository.queryRunner,
    );

    this.companyUserGroups = new GenericRepository<CompanyUserGroup>(
      CompanyUserGroup,
      this.entityManager,
      this.companyUserGroupRepository.queryRunner,
    );

    this.companies = new GenericRepository<Company>(
      Company,
      this.entityManager,
      this.companyRepository.queryRunner,
    );

    this.menuItemFeatures = new GenericRepository<MenuItemFeature>(
      MenuItemFeature,
      this.entityManager,
      this.menuItemFeatureRepository.queryRunner,
    );

    this.groupMenuItemFeatures = new GenericRepository<GroupMenuItemFeature>(
      GroupMenuItemFeature,
      this.entityManager,
      this.groupMenuItemFeatureRepository.queryRunner,
    );

    this.menuItems = new GenericRepository<MenuItem>(
      MenuItem,
      this.entityManager,
      this.menuItemRepository.queryRunner,
    );

    this.brands = new GenericRepository<Brand>(
      Brand,
      this.entityManager,
      this.brandRepository.queryRunner,
    );

    this.categories = new GenericRepository<Category>(
      Category,
      this.entityManager,
      this.categoryRepository.queryRunner,
    );

    this.customers = new GenericRepository<Customer>(
      Customer,
      this.entityManager,
      this.customerRepository.queryRunner,
    );

    this.customerAddresses = new GenericRepository<CustomerAddress>(
      CustomerAddress,
      this.entityManager,
      this.customerAddressRepository.queryRunner,
    );

    this.customerContacts = new GenericRepository<CustomerContact>(
      CustomerContact,
      this.entityManager,
      this.customerContactRepository.queryRunner,
    );

    this.customerDocumentConfigurations = new GenericRepository<CustomerDocumentConfiguration>(
      CustomerDocumentConfiguration,
      this.entityManager,
      this.customerDocumentConfigurationRepository.queryRunner,
    );

    this.customerDocuments = new GenericRepository<CustomerDocument>(
      CustomerDocument,
      this.entityManager,
      this.customerDocumentRepository.queryRunner,
    );

    this.models = new GenericRepository<Model>(
      Model,    
      this.entityManager,
      this.modelRepository.queryRunner, 
    );
  }
}