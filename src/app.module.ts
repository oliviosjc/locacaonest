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
import { EquipmentsModule } from './equipments/equipments.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PermissionInterceptor } from './interceptors/permission.interceptor';
import { CqrsModule } from '@nestjs/cqrs';

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
    CqrsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PermissionInterceptor
    }
  ],
})
export class AppModule { }
