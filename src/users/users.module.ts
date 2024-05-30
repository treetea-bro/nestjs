import { Module } from '@nestjs/common';
import { UserResolver } from './UserResolver';
import { UserService } from './UserService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { ConfigService } from '@nestjs/config';
import { UserSettingService } from './UserSettingService';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { UserSettingsResolver } from './UserSettingsResolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting])],
  providers: [
    ConfigService,
    UserResolver,
    UserService,
    UserSettingService,
    UserSettingsResolver,
  ],
})
export class UsersModule {}
