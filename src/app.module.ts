import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { GroupsModule } from './groups/groups.module';
import { MenuModule } from './menu/menu.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './database/configurations/db.module';
import { DataServiceModule } from './database/configurations/data-service.module';
import { AuthModule } from './auth/auth.module';
import { ClsModule } from 'nestjs-cls';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email/email.processor';
import { EquipmentsModule } from './equipments/equipments.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { ViewModule } from './view/view.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true }
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    DbModule,
    DataServiceModule,
    UsersModule,
    CompaniesModule,
    GroupsModule,
    MenuModule,
    AuthModule,
    EmailModule,
    EquipmentsModule,
    BackofficeModule,
    ViewModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
