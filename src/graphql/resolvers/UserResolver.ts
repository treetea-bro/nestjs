import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/User';
import { mockUsers } from 'src/__mocks__/mockUsers';
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class UserResolver {
  constructor(private configService: ConfigService) {}

  @Query(() => User, { nullable: true })
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return mockUsers.find((user) => user.id === id);
  }

  @Query(() => [User])
  getUsers() {
    return mockUsers;
  }

  @Mutation(() => Boolean, { name: 'uploadImage' })
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
