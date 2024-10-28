import { Injectable } from '@nestjs/common';
import { IDataService } from 'src/database/repositories/interfaces/data-service.interface';

@Injectable()
export class UsersService 
{
  async verifyUserCompanyGroupHandler(
    userId: string,
    companyId: string,
    groupId: string,
    dataService: IDataService,
    handler: string
  ): Promise<boolean> 
  {
    const result = await dataService.companyUserGroups
      .createQueryBuilder('companyUserGroup')
      .innerJoinAndSelect('companyUserGroup.group', 'group')
      .innerJoin('group.groupMenuItemFeatures', 'groupMenuItemFeature')
      .innerJoin('groupMenuItemFeature.menuItemFeature', 'menuItemFeature')
      .where('companyUserGroup.userId = :userId', { userId })
      .andWhere('companyUserGroup.companyId = :companyId', { companyId })
      .andWhere('companyUserGroup.groupId = :groupId', { groupId })
      .andWhere('menuItemFeature.handler = :handler', {
        handler: handler,
      })
      .getOne();

    return !!result;
  }
}
