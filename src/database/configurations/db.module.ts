import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { IDataService } from '../repositories/interfaces/data-service.interface';
import { GenericDataService } from '../repositories/implementations/data-service.implementation';
import { Group } from '../../groups/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
      ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../../**/entities/**/*.js'],
        migrations: [__dirname + '/../migrations/*.ts'],
        synchronize: false,
        ssl:
        {
          rejectUnauthorized: false
        }
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Group]),
  ],
  providers: [
    {
      provide: IDataService,
      useClass: GenericDataService
    }
  ],
  exports: [IDataService]
})
export class DbModule {}