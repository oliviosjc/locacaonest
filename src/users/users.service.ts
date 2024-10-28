import { Injectable } from '@nestjs/common';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';

@Injectable()
export class UsersService {
  async hasCreateUserPermission(userLoggedId: string, companyId: string, handler: string, dataService: any)
    : Promise<boolean> {
    const result = await dataService.companyUserGroups
      .createQueryBuilder('companyUserGroup')
      .innerJoin('companyUserGroup.group', 'group')
      .innerJoin('group.groupMenuItemFeatures', 'groupMenuItemFeature')
      .innerJoin('groupMenuItemFeature.menuItemFeature', 'menuItemFeature')
      .where('companyUserGroup.userId = :userId', { userId: userLoggedId })
      .andWhere('companyUserGroup.companyId = :companyId', { companyId })
      .andWhere('menuItemFeature.handler = :handler', { handler })
      .getOne();

    return result !== null;
  }
}
