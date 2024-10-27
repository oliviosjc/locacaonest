import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { GroupsModule } from './groups/groups.module';
import { MenuModule } from './menu/menu.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './database/configurations/db.module';
import { DataServiceModule } from './database/configurations/data-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    DataServiceModule,
    UsersModule, 
    CompaniesModule, 
    GroupsModule, 
    MenuModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
