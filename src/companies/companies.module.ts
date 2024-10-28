import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { CreateCompanyCommandHandler } from './handlers/create-company.handler';
import { UpdateCompanyCommandHandler } from './handlers/update-company.handler';

@Module({
  imports: [CqrsModule, AuthModule],
  providers: [CreateCompanyCommandHandler, UpdateCompanyCommandHandler],
  controllers: [CompaniesController]
})
export class CompaniesModule {}
