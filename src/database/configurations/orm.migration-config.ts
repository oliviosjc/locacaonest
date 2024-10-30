import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { CompanyUserGroup } from '../../companies/entities/company-user-group.entity';
import { Company } from '../../companies/entities/company.entity';
import { GroupMenuItemFeature } from '../../groups/entities/group-menu-item-feature.entity';
import { Group } from '../../groups/entities/group.entity';
import { MenuItemFeature } from '../../menu/entities/menu-item-feature.entity';
import { MenuItem } from '../../menu/entities/menu-item.entity';
import { User } from '../../users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Customer } from '../../backoffice/entities/customers/customer.entity';
import { Model } from '../../backoffice/entities/models/model.entity';
import { CustomerAddress } from '../../backoffice/entities/customers/customer-address.entity';
import { CustomerContact } from '../../backoffice/entities/customers/customer-contact.entity';
import { Brand } from '../../backoffice/entities/brands/brand.entity';
import { Category } from '../../backoffice/entities/categories/category.entity';
import { CustomerDocumentConfiguration } from '../../backoffice/entities/customers/customer-document-configuration.entity';
import { CustomerDocument } from '../../backoffice/entities/customers/customer-document.entity';
import { CategoryTechnicalInformation } from '../../backoffice/entities/categories/category-technical-information.entity';
import { ModelCategoryTechnicalInformationAnswer } from '../../backoffice/entities/models/model-category-technical-information-answer.entity';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  schema: configService.get<string>('DB_SCHEMA'),
  entities: [
    User,
    Company,
    CompanyUserGroup,
    GroupMenuItemFeature,
    Group,
    MenuItem,
    MenuItemFeature,
    Brand,
    Category,
    CategoryTechnicalInformation,
    Customer,
    CustomerAddress,
    CustomerContact,
    CustomerDocumentConfiguration,
    CustomerDocument,
    Model,
    ModelCategoryTechnicalInformationAnswer
  ],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  synchronize: false,
  ssl:
  {
    rejectUnauthorized: false
  },
  logging: true
};

export default new DataSource(dataSourceOptions);