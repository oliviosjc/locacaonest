import { Module, Global } from '@nestjs/common';
import { DbModule } from './db.module';

@Global()
@Module({
  imports: [DbModule],
  exports: [DbModule],
})
export class DataServiceModule {}