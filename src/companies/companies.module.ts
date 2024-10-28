import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { CreateCompanyCommandHandler } from './handlers/create-company.handler';

@Module({
  imports: [CqrsModule, AuthModule],
  providers: [CreateCompanyCommandHandler],
  controllers: [CompaniesController]
})
export class CompaniesModule {}
