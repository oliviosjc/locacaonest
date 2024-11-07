import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async hasUserPermission(userLoggedId: string, companyId: string, groupId: string, handler: string, dataService: any)
    : Promise<boolean> {
    const result = await dataService.companyUserGroups
      .createQueryBuilder('companyUserGroup')
      .innerJoin('companyUserGroup.group', 'group')
      .innerJoin('group.groupMenuItemFeatures', 'groupMenuItemFeature')
      .innerJoin('groupMenuItemFeature.menuItemFeature', 'menuItemFeature')
      .where('companyUserGroup.userId = :userId', { userId: userLoggedId })
      .andWhere('companyUserGroup.companyId = :companyId', { companyId })
      .andWhere('companyUserGroup.groupId = :groupId', { groupId })
      .andWhere('menuItemFeature.handler = :handler', { handler })
      .getOne();

    return result !== null;
  }
}
