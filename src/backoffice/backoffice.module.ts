import { Module } from '@nestjs/common';
import { BackofficeController } from './backoffice.controller';
import { CreateBrandCommandHandler } from './handlers/brands/create-brand.handler';
import { CreateCategoryCommandHandler } from './handlers/categories/create-category.handler';

@Module({
  controllers: [BackofficeController],
  providers: [
    CreateBrandCommandHandler,
    CreateCategoryCommandHandler
  ]
})
export class BackofficeModule {}
