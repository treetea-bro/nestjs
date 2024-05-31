import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSetting } from '../graphql/models/UserSetting';
import { createUserSettingsInput } from '../graphql/utils/CreateUserSettingsInput';
import { UserSettingService } from '../users/UserSettingService';

@Resolver()
export class UserSettingsResolver {
  constructor(private userSettingsService: UserSettingService) {}

  @Query(() => UserSetting)
  getUserSettingById(@Args('id') id: number) {
    return this.userSettingsService.getUserSettingById(id);
  }

  @Mutation(() => UserSetting)
  createUserSettings(
    @Args('createUserSettingsData')
    createUserSettingsData: createUserSettingsInput,
  ) {
    return this.userSettingsService.createUserSettings(createUserSettingsData);
  }
}
