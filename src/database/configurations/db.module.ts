import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { IDataService } from '../repositories/interfaces/data-service.interface';
import { GenericDataService } from '../repositories/implementations/data-service.implementation';
import { Group } from '../../groups/entities/group.entity';
import { CompanyUserGroup } from '../../companies/entities/company-user-group.entity';
import { Company } from '../../companies/entities/company.entity';
import { GroupMenuItemFeature } from '../../groups/entities/group-menu-item-feature.entity';
import { MenuItem } from '../../menu/entities/menu-item.entity';
import { MenuItemFeature } from '../../menu/entities/menu-item-feature.entity';
import { Brand } from '../../backoffice/entities/brand.entity';
import { Category } from '../../backoffice/entities/category.entity';
import { Customer } from '../../backoffice/entities/customers/customer.entity';
import { Model } from '../../backoffice/entities/model.entity';
import { CustomerAddress } from '../../backoffice/entities/customers/customer-address.entity';
import { CustomerContact } from '../../backoffice/entities/customers/customer-contact.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
      ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../../**/entities/**/*.js'],
        migrations: [__dirname + '/../migrations/*.ts'],
        synchronize: false,
        ssl:
        {
          rejectUnauthorized: false
        },
        logging: true
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User,
      Group,
      GroupMenuItemFeature,
      MenuItem,
      MenuItemFeature,
      CompanyUserGroup,
      Company,
      Brand,
      Category,
      Customer,
      CustomerAddress,
      CustomerContact,
      Model]),
  ],
  providers: [
    {
      provide: IDataService,
      useClass: GenericDataService
    }
  ],
  exports: [IDataService]
})
export class DbModule { }