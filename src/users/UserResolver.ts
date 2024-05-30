import { ConfigService } from '@nestjs/config';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { join } from 'path';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { CreateUserInput } from 'src/graphql/utils/CreateUserInput';
import { UserService } from './UserService';
import { UserSettingService } from './UserSettingService';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private userSettingService: UserSettingService,
    private configService: ConfigService,
  ) {}

  @Query(() => User, { nullable: true })
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUserById(id);
  }

  @Query(() => [User])
  getUsers() {
    return this.userService.getUsers();
  }

  // @ResolveField(() => UserSetting, { name: 'settings', nullable: true })
  // getUserSettings(@Parent() user: User) {
  //   return this.userSettingService.getUserSettingById(user.id);
  // }

  @Mutation(() => User)
  createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return this.userService.createUser(createUserData);
  }

  @Mutation(() => Boolean)
  async uploadImage(
    @Args('image', { type: () => GraphQLUpload })
    image: Upload,
    @Args('createFileInDirectory', { type: () => Boolean })
    createFileInDirectory: boolean,
  ) {
    const file = await image;

    return new Promise((resolve, reject) => {
      if (createFileInDirectory) {
        const rootPath = this.configService.get<string>('rootPath');
        const uploadsPath = this.configService.get<string>('uploadsPath');

        console.log(uploadsPath, existsSync(uploadsPath));

        if (!existsSync(uploadsPath)) {
          mkdirSync(uploadsPath, { recursive: true });
        }

        file
          .createReadStream()
          .pipe(createWriteStream(`${uploadsPath}/${file.filename}`))
          .on('finish', () => {
            console.log('IMAGE_CREATED_IN_DIRECTORY');

            loadImage(join(uploadsPath, file.filename)).then(async (img) => {
              registerFont(join(rootPath, 'NotoSansKR-Regular.ttf'), {
                family: 'NotoSansKR',
              });
              const create = createCanvas(1024, 500);
              const context = create.getContext('2d');
              console.log(img);
              context.drawImage(img, 0, 0, 1024, 500);
              context.fillStyle = '#ffffff';
              context.font = '52px NotoSansKR';
              context.fillText('안녕ddㅓㅏ미zzzzcv', 360, 360);
              context.beginPath();
              context.arc(512, 166, 128, 0, Math.PI * 2, true);
              context.stroke();
              context.fill();
              const buffer = create.toBuffer('image/png');
              // 파일로 저장
              writeFileSync(join(rootPath, 'output.png'), buffer);
            });

            resolve(true);
          })
          .on('error', (error) => {
            console.log('IMAGE_UPLOAD_ERROR', error);
            reject(false);
          });
      }
    });
  }
}
