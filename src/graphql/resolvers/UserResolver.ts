import { Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/User';

@Resolver()
export class UserResolver {
  @Query(() => User)
  getUser() {
    return {
      id: 1,
      username: 'anson',
      displayName: 'Anson The Developer',
    };
  }
}
