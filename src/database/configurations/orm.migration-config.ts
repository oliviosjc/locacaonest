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

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [
    User,
    Company,
    CompanyUserGroup,
    GroupMenuItemFeature,
    Group,
    MenuItem,
    MenuItemFeature,
  ],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  synchronize: false,
  ssl:
  {
    rejectUnauthorized: false
  }
};

export default new DataSource(dataSourceOptions);