import { Module } from '@nestjs/common';
import { BackofficeController } from './backoffice.controller';
import { CreateBrandCommandHandler } from './handlers/brands/create-brand.handler';
import { CreateCategoryCommandHandler } from './handlers/categories/create-category.handler';
import { CreateModelCommandHandler } from './handlers/models/create-model.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { CreateCustomerCommandHandler } from './handlers/customers/create-customer.handler';
import { CreateCustomerAddressCommandHandler } from './handlers/customers/addresses/create-customer-address.handler';
import { CreateCustomerContactCommand } from './commands/customers/contacts/create-customer-contact.command';

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [BackofficeController],
  providers: [
    CreateBrandCommandHandler,
    CreateCategoryCommandHandler,
    CreateModelCommandHandler,
    CreateCustomerCommandHandler,
    CreateCustomerAddressCommandHandler,
    CreateCustomerContactCommand
  ]
})
export class BackofficeModule {}
