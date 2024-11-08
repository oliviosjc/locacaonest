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
import { CreateCustomerDocumentConfigurationCommandHandler } from './handlers/documents/create-customer-document-configuration.handler';
import { UsersModule } from 'src/users/users.module';
import { UpdateBrandCommandHandler } from './handlers/brands/update-brand.handler';
import { UpdateCategoryCommandHandler } from './handlers/categories/update-category.handler';

@Module({
  imports: [CqrsModule, AuthModule, UsersModule],
  controllers: [BackofficeController],
  providers: [
    CreateBrandCommandHandler,
    UpdateBrandCommandHandler,
    CreateCategoryCommandHandler,
    UpdateCategoryCommandHandler,
    CreateModelCommandHandler,
    CreateCustomerCommandHandler,
    CreateCustomerAddressCommandHandler,
    CreateCustomerContactCommand,
    CreateCustomerDocumentConfigurationCommandHandler
  ]
})
export class BackofficeModule {}
