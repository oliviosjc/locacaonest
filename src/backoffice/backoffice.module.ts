import { Module } from '@nestjs/common';
import { BackofficeController } from './backoffice.controller';
import { CreateBrandCommandHandler } from './handlers/brands/create-brand.handler';
import { CreateCategoryCommandHandler } from './handlers/categories/create-category.handler';
import { CreateModelCommandHandler } from './handlers/models/create-model.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { CreateCustomerCommandHandler } from './handlers/customers/create-customer.handler';
import { CreateCustomerAddressCommandHandler } from './handlers/customers/addresses/create-customer-address.handler';
import { CreateCustomerDocumentConfigurationCommandHandler } from './handlers/documents/create-customer-document-configuration.handler';
import { UsersModule } from 'src/users/users.module';
import { UpdateBrandCommandHandler } from './handlers/brands/update-brand.handler';
import { UpdateCategoryCommandHandler } from './handlers/categories/update-category.handler';
import { UpdateCustomerContactCommandHandler } from './handlers/customers/contacts/update-customer-contact.handler';
import { DeleteCustomerContactCommandHandler } from './handlers/customers/contacts/delete-customer-contact.handler';
import { UpdateCustomerAddressCommandHandler } from './handlers/customers/addresses/update-customer-address.handler';
import { DeleteCustomerAddressCommandHandler } from './handlers/customers/addresses/delete-customer-address.handler';
import { CreateCustomerContactCommandHandler } from './handlers/customers/contacts/create-customer-contact.handler';

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
    UpdateCustomerAddressCommandHandler,
    DeleteCustomerAddressCommandHandler,
    CreateCustomerContactCommandHandler,
    UpdateCustomerContactCommandHandler,
    DeleteCustomerContactCommandHandler,
    CreateCustomerDocumentConfigurationCommandHandler
  ]
})
export class BackofficeModule {}
