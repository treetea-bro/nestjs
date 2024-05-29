import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/User';
import { mockUsers } from 'src/__mocks__/mockUsers';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import Jimp from 'jimp';

async function addWatermark(inputImagePath, outputImagePath, watermarkText) {
  const image = await Jimp.read(inputImagePath);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

  image.print(
    font,
    10, // x
    10, // y
    {
      text: watermarkText,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP,
    },
    image.bitmap.width,
    image.bitmap.height,
  );

  await image.writeAsync(outputImagePath);
}

@Resolver()
export class UserResolver {
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
    @Args({ name: 'image', type: () => GraphQLUpload })
    image: Upload,
    @Args({ name: 'createFileInDirectory', type: () => Boolean })
    createFileInDirectory: boolean,
  ) {
    const file = await image;

    console.log(file.filename);
    console.log('UPLOAD_IMAGE_CALLED', {
      file,
      createFileInDirectory,
    });

    return new Promise((resolve, reject) => {
      if (createFileInDirectory) {
        const dirPath = join(__dirname, '/uploads');

        console.log(dirPath, existsSync(dirPath));

        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }

        file
          .createReadStream()
          .pipe(createWriteStream(`${dirPath}/${file.filename}`))
          .on('finish', () => {
            console.log('IMAGE_CREATED_IN_DIRECTORY');
            addWatermark(
              join(dirPath, file.filename),
              join(dirPath, 'new.jpg'),
              'Watermark',
            );
            resolve(true);
          })
          .on('error', (error) => {
            console.log('IMAGE_UPLOAD_ERROR', error);
            reject(false);
          });
      } else {
        file
          .createReadStream()
          .on('data', (data) => {
            console.log('DATE_FROM_STREAM', data);
          })
          .on('end', () => {
            console.log('END_OF_STREAM');
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
