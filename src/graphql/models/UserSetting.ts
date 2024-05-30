import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'user_settings' })
@ObjectType()
export class UserSetting {
  @PrimaryColumn()
  @Field(() => Int)
  userId: number;

  @Column({ default: false })
  @Field({ defaultValue: false })
  receiveNotifications: boolean;

  @Column({ default: false })
  @Field({ defaultValue: false })
  receiveEmails: boolean;
}
